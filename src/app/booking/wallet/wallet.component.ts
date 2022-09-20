import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { SharedService } from '../../../shared/service/shared.service';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../../shared/service/api.service';
import { ApiEndpoints } from '../../../shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';
import { Router } from '@angular/router';
import { SortOrder, ColDef } from '../../pods-table/pods-table.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import * as braintree from 'braintree-web';
import { Subject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit, AfterViewInit, OnDestroy {
  walletBalance: number = 0;
  amount: number;
  stripe: any;
  loading = false;
  confirmation: any;
  selectedMethord: any;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: any = 'Please enter card details';
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  @ViewChild('checkout', { read: NgForm }) form: NgForm;
  @ViewChild('paypal', { read: ElementRef })
  paypalButton: ElementRef<HTMLElement>;

  columns: Array<ColDef> = [
    {
      label: 'Transaction ID',
      dataKey: 'txn_id',
    },
    {
      label: 'Transaction Date',
      dataKey: 'created_at',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let datePipe = new DatePipe('en-US');
        return datePipe.transform(data.created_at, 'MM-dd-yyyy hh:mm:ss');
      },
    },
    {
      label: 'Total Amount',
      dataKey: 'amount',
      renderer: function (data: any) {
        let currencyPipe = new CurrencyPipe('en-US', CONSTANTS.CURRENCY_FORMAT);

        if (data.type == 'credit') {
          return (
            '<label> <i class="credit fa fa-arrow-circle-up"></i> ' +
            currencyPipe.transform(data.amount) +
            ' </label>'
          );
        } else {
          return (
            '<label> <i class="debit fa fa-arrow-circle-down"></i> ' +
            currencyPipe.transform(data.amount) +
            ' </label>'
          );
        }
        // return data.txn_unit+' '+data.amount;
      },
    },
    {
      label: 'Status',
      dataKey: 'status',
      renderer: function (data: any) {
        if (data.status == 1) {
          return '<label class="transaction btn btn-outline-success"></label>';
        } else if (data.status == 2) {
          return '<label class="transaction btn-outline-danger">Failed</label>';
        } else {
          return '<label class="transaction btn-outline-warning">Pending</label>';
        }
      },
    },
  ];
  currentPage = 1;
  transactions: Array<any> = [];

  braintreeError: any = 'Please enter card details';
  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;
  cardDisabled: any = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  constructor(
    private apiService: ApiService,
    private sharedService: SharedService,
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve: true
    };
    this.getWalletBalance();
    this.getWalletTransactions();
    this.initPaypal();
  }

  ngAfterViewInit() {
    this.stripeService
      .setPublishableKey(environment.stripeKey)
      .then((stripe) => {
        this.stripe = stripe;
        console.log(stripe);
        const elements = stripe.elements();
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
        this.selectedMethord = this.card;
        console.log(this.form);
      });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
    this.dtTrigger.unsubscribe();

  }

  onChange(event: any) {
    if (event.complete && event.brand != 'unknown') {
      this.error = null;
    } else if (event.empty) {
      this.error = 'Please enter card details';
    } else if (event.error) {
      this.error = event.error.message;
    } else if (event.brand == 'unknown') {
      this.error = 'Please enter a valid card details';
    }
    this.cd.detectChanges();
  }

  initPaypal() {
    braintree.client.create(
      {
        authorization: environment.braintree_key,
      },
      (clientErr: any, clientInstance: any) => {
        if (clientErr) {
          console.log('Error creating client:', clientErr);
          return;
        }

        // braintree.paypal.create({
        //   client: clientInstance
        // }, (paypalErr:any, paypalInstance:any) =>{
        //   if (paypalErr) {
        //     console.log('Error creating PayPal:', paypalErr);
        //     return;
        //   }

        //   if(!this.cardDisabled)
        //   this.paypalButton.nativeElement.removeAttribute('disabled');
        //   this.paypalInstance=paypalInstance;

        // });

        braintree.hostedFields
          .create({
            client: clientInstance,
            styles: {
              input: {
                'font-size': '14px',
                height: 'auto',
              },
              'input.invalid': {
                color: 'red',
              },
              'input.valid': {
                color: 'green',
              },
            },

            // The hosted fields that we will be using
            // NOTE : cardholder's name field is not available in the field options
            // and a separate input field has to be used incase you need it
            fields: {
              number: {
                selector: '#card-number',
                placeholder: 'Card Number',
              },
              cvv: {
                selector: '#cvv',
                placeholder: 'CVV',
              },
              expirationDate: {
                selector: '#expiration-date',
                placeholder: 'MM/YYYY',
              },
            },
          })
          .then((hostedFieldsInstance) => {
            this.hostedFieldsInstance = hostedFieldsInstance;
            if (!this.cardDisabled)
              this.paypalButton.nativeElement.removeAttribute('disabled');

            hostedFieldsInstance.on('focus', (event) => {
              const field = event.fields[event.emittedBy];
              this.checkValidity(event);
              // const label:any = this.findLabel(field);
              // label.classList.remove('filled');
              // added and removed css classes
              // can add custom code for custom validations here
              console.log(event);
            });

            hostedFieldsInstance.on('blur', (event) => {
              const field = event.fields[event.emittedBy];
              // const label = this.findLabel(field);
              // console.log(event)
              // fetched label to apply custom validations
              // can add custom code for custom validations here
            });

            hostedFieldsInstance.on('empty', (event) => {
              const field = event.fields[event.emittedBy];
              // this.error=
              // console.log(event)
              // can add custom code for custom validations here
            });
            hostedFieldsInstance.on('validityChange', (event) => {
              const field = event.fields[event.emittedBy];
              this.checkValidity(event);
              // const label:any = this.findLabel(field);
              // if (field.isPotentiallyValid) { // applying custom css and validations
              //   label.classList.remove('invalid');
              // } else {
              //   label.classList.add('invalid');
              // }
              // console.log(event)
              // can add custom code for custom validations here
            });
          });
      }
    );
  }

  checkValidity(event: any) {
    if (!event.fields.number.isValid) {
      this.braintreeError = 'Please enter a valid card number';
    } else if (!event.fields.expirationDate.isValid) {
      this.braintreeError = 'Please enter a valid date';
    } else if (!event.fields.cvv.isValid) {
      this.braintreeError = 'Please enter a valid cvv';
    } else {
      this.braintreeError = null;
    }
  }

  findLabel(field: any) {
    return document.querySelector(
      '.hosted-field--label[for="' + field.container.id + '"]'
    );
  }

  openPaymentPopup() {
    if (!this.amount) {
      return;
    }
    // $('#add_to_wallet').show()
    //jQuery\.noConflict\(\);
    $('#add_to_wallet').modal('show');
  }

  async onSubmit() {
    if (this.selectedMethord == 'paypal') {
      this.pay();
    } else {
      console.log(this.selectedMethord);
      let reqObj: any = { amount: this.amount };
      reqObj.user_id = this.sharedService.getUserDetails().user_id;
      reqObj.pg_type = 1;
      this.apiService
        .post(
          environment.baseURL + ApiEndpoints.CREATE_WALLET_PAYMENT_INTENT,
          reqObj
        )
        .subscribe((resp) => {
          console.log(resp);
          this.onTokenSuccess(
            this.stripe,
            this.selectedMethord,
            resp.data.pi_id
          );
        });
    }
  }

  pay() {
    // this.paypalInstance.tokenize({
    //   flow: 'vault'
    //   // For more tokenization options, see the full PayPal tokenization documentation
    //   // https://braintree.github.io/braintree-web/current/PayPal.html#tokenize
    // }, (tokenizeErr:any, payload:any)=>{
    //   if (tokenizeErr) {
    //     if (tokenizeErr.type !== 'CUSTOMER') {
    //       console.log('Error tokenizing:', tokenizeErr);
    //     }
    //     return;
    //   }

    //   // Tokenization succeeded
    //   // this.paypalButton.nativeElement.setAttribute('disabled', "true");
    //   console.log('Got a nonce! You should submit this to your server.');
    //   console.log(payload.nonce);
    //   this.payWithPayPal(payload.nonce)
    // });
    this.hostedFieldsInstance
      .tokenize({ cardholderName: this.cardholdersName })
      .then((payload) => {
        console.log(payload);
        // Example payload return on succesful tokenization

        /* {nonce: "tokencc_bh_hq4n85_gxcw4v_dpnw4z_dcphp8_db4", details: {…},
      description: "ending in 11", type: "CreditCard", binData: {…}}
      binData: {prepaid: "Unknown", healthcare: "Unknown", debit: "Unknown", durbinRegulated: "Unknown", commercial: "Unknown", …}
      description: "ending in 11"
      details: {bin: "411111", cardType: "Visa", lastFour: "1111", lastTwo: "11"}
      nonce: "tokencc_bh_hq4n85_gxcw4v_dpnw4z_dcphp8_db4"
      type: "CreditCard"
      __proto__: Object
      */

        // submit payload.nonce to the server from here
        console.log(payload.nonce);
        this.payWithPayPal(payload.nonce);
      })
      .catch((error) => {
        console.log(error);
        // perform custom validation here or log errors
      });
  }

  payWithPayPal(nonce: any) {
    let reqObj: any = { amount: this.amount };
    reqObj.nonce = nonce;
    reqObj.user_id = this.sharedService.getUserDetails().user_id;
    reqObj.pg_type = 2;

    this.apiService
      .post(environment.baseURL + ApiEndpoints.BRAINTREE_ADD_TO_WALLET, reqObj)
      .subscribe((resp) => {
        console.log(resp);
        this.sharedService.bookingSession = null;
        this.amount = 0;
        document.getElementById('closeWallet')?.click();
        this.getWalletBalance();
        this.getWalletTransactions();
      });
  }

  onTokenSuccess(stripe: any, card: any, clientSecret: any) {
    if (card.id) {
      this.apiService.showSpinner();
      this.stripe
        .confirmCardPayment(clientSecret, {
          payment_method: card.id,
        })
        .then((result: any) => {
          // this.apiService.hideSpinner()
          // if (result.error) {
          //   // Show error to your customer
          //   console.log(result.error.message);
          // } else {
          //   // The payment succeeded!
          //   console.log(result.paymentIntent.id);

          // }
          if (result.error) {
            this.error = result.error.message;
          } else {
            this.submitPayment(result.paymentIntent.id);
          }
        });
    } else {
      this.apiService.showSpinner();
      this.stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
          },
        })
        .then((result: any) => {
          // this.apiService.hideSpinner()
          // if (result.error) {
          //   // Show error to your customer
          //   console.log(result.error.message);
          //   console.log(result.paymentIntent.id);
          // } else {
          //   // The payment succeeded!
          //   console.log(result.paymentIntent.id);

          // }
          if (result.error) {
            this.error = result.error.message;
          } else {
            this.submitPayment(result.paymentIntent.id);
          }
        });
    }
  }

  submitPayment(id: any) {
    let reqObj: any = {};
    reqObj.user_id = this.sharedService.getUserDetails().user_id;
    reqObj.pg_type = 1;
    reqObj.pi_id = id;

    this.apiService
      .post(environment.baseURL + ApiEndpoints.ADD_TO_WALLET, reqObj)
      .subscribe((resp) => {
        console.log(resp);
        this.amount = 0;
        document.getElementById('closeWallet')?.click();
        this.getWalletBalance();
        this.getWalletTransactions();
      });
  }

  sortColumn(colDef: any) {
    console.log('sort from booking history', colDef);
    if (colDef.sortOrder == SortOrder.asc) {
      colDef.sortOrder = SortOrder.desc;
    } else {
      colDef.sortOrder = SortOrder.asc;
    }
  }

  getFormValid(): boolean {
    if (this.selectedMethord == this.card) {
      return this.error == null;
    } else if (this.selectedMethord == 'paypal') {
      return this.braintreeError == null;
    } else if (this.selectedMethord.id) {
      return true;
    }
    return false;
  }

  getWalletBalance() {
    if (!this.sharedService.getUserDetails()) {
      return;
    }
    let reqObj = {
      user_id: this.sharedService.getUserDetails()
        ? this.sharedService.getUserDetails().user_id
        : null,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.GET_WALLET_BALANCE, reqObj)
      .subscribe(
        (data) => {
          console.log(data);
          this.walletBalance = data.data;
        },
        (error) => {
          this.walletBalance = 0;
          // console.log(error);
        }
      );
  }

  navigateDashboard() {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === 1) {
        localStorage.setItem(CONSTANTS.ROLE, 'guest');
        this.router.navigateByUrl('/guest');
      } else if (user.user_type === 2) {
        localStorage.setItem(CONSTANTS.ROLE, 'guest');
        this.router.navigateByUrl('/host');
      } else {
        let role = localStorage.getItem(CONSTANTS.ROLE);
        if (role == 'guest') {
          this.router.navigateByUrl('/guest');
        } else {
          this.router.navigateByUrl('/host');
        }
      }
    }
  }

  getWalletTransactions() {
    let reqObj: any = {};
    reqObj.user_id = this.sharedService.getUserDetails().user_id;

    this.apiService
      .post(environment.baseURL + ApiEndpoints.GET_WALLET_TRANSACTIONS, reqObj)
      .subscribe((resp) => {
        console.log(resp);
        this.transactions = resp.data;
        this.dtTrigger.next();
      },
      err => {
        console.log(err);
        this.dtTrigger.next();
      });
  }

  get role() {
    let r = localStorage.getItem(CONSTANTS.ROLE);
    r = r || '';
    return r;
  }

}
