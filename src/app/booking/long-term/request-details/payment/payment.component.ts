import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, NgForm, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import * as braintree from 'braintree-web';
import { el } from 'date-fns/esm/locale';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ROLE } from 'src/app/app.constants';
declare var $: any

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() charges: number;
  @Input() request_id: any;
  @Output() submitPaymentEvent: EventEmitter<any> = new EventEmitter<any>();

  savedCards: Array<any> = [];
  walletBalance: number;
  selectedMethord: any;
  selectedMethordWallet: any;
  stripe: any;
  loading = false;
  confirmation: any;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: any = 'Please enter card details';
  braintreeError: any = 'Please enter card details';

  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;
  paypalInstance: any;
  bookingInfo: any = {};
  remainingAmount: any = 0;
  cardDisabledOnlyWalletActive: any = false;
  walletChecked: boolean = false;
  amount: number;
  isCouponApplied: boolean = false;
  pricing: any = {};
  applyCouponForm: FormGroup;
  bookingError: any;
  isProcessingPayment = false
  couponCode = ''
  getClientTokenApiUrl: any = environment.baseURL + ApiEndpoints.GET_PAYMENT_INTENT;
  createPurchaseApiUrl: any = environment.baseURL + ApiEndpoints.SUBMIT_PAYPAL;
  paymentResponse: any;
  chargeAmount = 55.55;


  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  @ViewChild('cardInfoWallet', { static: false }) cardInfoWallet: ElementRef;
  @ViewChild('checkout', { read: NgForm }) form: NgForm;
  @ViewChild('paypal', { read: ElementRef }) paypalButton: ElementRef<HTMLElement>;

  braintreeErrorSecation: number;
  loginUser: any;
  userCurrentlySelectedRole: string | null;

  constructor(private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.loginUser = this.sharedService.getUserDetails();
    this.userCurrentlySelectedRole = localStorage.getItem(ROLE);
    this.walletBalance = 0;
    this.getWalletBalance();
    this.applyWallet({target:{checked:false}});
    this.initPaypal();

  }

  ngAfterViewInit() {
    this.stripeService.setPublishableKey(environment.stripeKey).then(stripe => {
      this.stripe = stripe;
      console.log(stripe)
      const elements = stripe.elements();
      this.card = elements.create('card');
      this.card.mount(this.cardInfo.nativeElement);
      this.card.addEventListener('change', this.cardHandler);
      this.selectedMethord = 'stripe';
      console.log(this.form)
    });
  }

  onChange(event: any) {
    console.log(this.selectedMethord)
    if (event.complete) {
      this.error = null;
    } else if (event.empty) {
      this.error = 'Please enter card details';
    } else if (event.error) {
      this.error = event.error.message;
    }
    this.cd.detectChanges();
  }




  async continue() {

    if (this.selectedMethord == 'paypal') {
      this.submitPayPal();
    }
    else if(this.cardDisabledOnlyWalletActive){
      this.payWithWallet()
    }
    else{
      this.initStripe();
    }

  }

  getFormValid():boolean{
    if(this.selectedMethord=='stripe'){
      return this.error==null
    }else if(this.selectedMethord=='paypal'){
      return this.braintreeError==null
    }else if(this.cardDisabledOnlyWalletActive){
      return true
    }
    return false
  }





  //paypal
  initPaypal() {
    braintree.client.create({ authorization: environment.braintree_key }, (clientErr: any, clientInstance: any) => {
      if (clientErr) {
        console.log('Error creating client:', clientErr);
        return;
      }
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '14px',
            'height': 'auto'
          },
          'input.invalid': {
            'color': 'red'
          },
          'input.valid': {
            'color': 'green'
          }
        },

        // The hosted fields that we will be using
        // NOTE : cardholder's name field is not available in the field options
        // and a separate input field has to be used incase you need it
        fields: {
          number: {
            selector: '#card-number',
            placeholder: 'Card Number'
          },
          cvv: {
            selector: '#cvv',
            placeholder: 'CVV'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: 'MM/YYYY'
          }
        }
      }).then((hostedFieldsInstance) => {

        this.hostedFieldsInstance = hostedFieldsInstance;
        if (!this.cardDisabledOnlyWalletActive)
          this.paypalButton.nativeElement.removeAttribute('disabled');

        hostedFieldsInstance.on('focus', (event) => {
          const field = event.fields[event.emittedBy];
          this.checkValidity(event)
          // const label:any = this.findLabel(field);
          // label.classList.remove('filled'); 
          // added and removed css classes
          // can add custom code for custom validations here
          console.log(event)
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
          this.checkValidity(event)
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
    });
  }
  checkValidity(event: any) {
    if (!event.fields.number.isValid) {
      this.braintreeError = "Enter a valid card number";
      this.braintreeErrorSecation = 1;
    } else if (!event.fields.expirationDate.isValid) {
      this.braintreeError = "Enter a valid date";
      this.braintreeErrorSecation = 2;
    } else if (!event.fields.cvv.isValid) {
      this.braintreeError = "Enter a valid cvv";
      this.braintreeErrorSecation = 3;
    } else {
      this.braintreeError = null
      this.braintreeErrorSecation = 0;
    }
  }
  async submitPayPal() {
    const payload = await this.hostedFieldsInstance.tokenize({ cardholderName: this.cardholdersName });
    if (payload) {
      const reqData = {
        user_id: this.loginUser.user_id,
        user_type: this.userCurrentlySelectedRole,
        request_id: this.request_id,
        nonce: payload.nonce,
        payment_method: 2
      };
      try {
        const res: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.longTermProperty.SUBMIT_PAYPAL, reqData);
        if(res && res.status){
          this.submitPaymentEvent.emit();        
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  }


  //stripe
  async initStripe(){
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.request_id,
      payment_method: this.walletChecked ? 4 : 1,
      customer_id : 'cus_L4D9bMUKWTLj6w',
      saveFutureUses : this.card.id ? false : true
    };
    try {
      const res: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.longTermProperty.GET_PAYMENT_INTENT, reqData);
      if (res && res.data && res.data.pi_id) {
        this.stripeTokenSuccess(res.data.pi_id)
      }
    } catch (error) {
      console.log(error);
    }
  }
  stripeTokenSuccess(clientSecret:any){
    const reqData : any = this.card.id ? this.card.id : {card: this.card};
    this.apiService.showSpinner()
    this.stripe.confirmCardPayment(clientSecret, {payment_method: reqData}).then((result:any)=>{
      if (result.error) {
        this.apiService.hideSpinner()
        console.log(result.error.message);
      } else {
        this.apiService.hideSpinner()
        console.log(result.paymentIntent.id);
        this.submitStripe(result.paymentIntent.id)
      }
    });
  }
  async submitStripe(id:any){
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.request_id,
      payment_method: this.walletChecked ? 4 : 1,
      pi_id : id,
    };
    try {
      const res: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.longTermProperty.SUBMIT_PAYMENT, reqData);
      if(res && res.status){
        this.submitPaymentEvent.emit();        
      }
    } catch (error) {
      console.log(error);
    }
  }


  //wallet
  async getWalletBalance() {
    try {
      const res: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.GET_WALLET_BALANCE, { user_id: this.loginUser.user_id });
      if (res) {
        this.walletBalance = Number(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async applyWallet(event: any) {
    const value: boolean = event.target.checked;
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.request_id,
      wallet: value ? 1 : 0,
      payment_method: 3
    };
    try {
      const res: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.longTermProperty.APPLY_WALLET, reqData);
      if (res) {
        this.remainingAmount = res.data.remaining_payout;
        this.cardDisabledOnlyWalletActive = res.data.wallet_full_payment;
        this.selectedMethord = null;
      }
    } catch (error) {
      console.log(error);
      event.target.checked = value ? false : true;
    }
  }
  async payWithWallet() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.request_id,
      payment_method: 3
    };
    try {
      const res: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.longTermProperty.SUBMIT_WALLET_PAYMENT, reqData);
      if(res && res.status){
        this.submitPaymentEvent.emit();        
      }
    } catch (error) {
      console.log(error);
    }
  }


  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }

  }



}
