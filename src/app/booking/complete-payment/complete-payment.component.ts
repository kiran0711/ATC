import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../shared/service/api.service';
import { FormBuilder, NgForm,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/service/shared.service';
import {
  environment
} from 'src/environments/environment';
import {
  ApiEndpoints
} from 'src/shared/utils/api-url';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import * as braintree from 'braintree-web';
import { el } from 'date-fns/esm/locale';
declare var $: any 


@Component({
  selector: 'app-complete-payment',
  templateUrl: './complete-payment.component.html',
  styleUrls: ['./complete-payment.component.css']
})
export class CompletePaymentComponent implements OnInit,AfterViewInit, OnDestroy {
  savedCards:Array<any>=[];
  walletBalance:any;
  selectedMethord:any;
  selectedMethordWallet:any;
  stripe:any;
  loading = false;
  confirmation:any;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: any='Please enter card details';
  braintreeError: any='Please enter card details';

  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;
  paypalInstance:any;
  bookingInfo:any={};
  remainingAmount:any=0;
  cardDisabled:any=false;
  wallet:boolean=false;
  amount:number;
  isCouponApplied:boolean=false;
  pricing:any={};
  applyCouponForm:FormGroup;
  bookingError:any;
  isProcessingPayment=false
  couponCode=''
  getClientTokenApiUrl:any = environment.baseURL + ApiEndpoints.GET_PAYMENT_INTENT;
  createPurchaseApiUrl:any = environment.baseURL + ApiEndpoints.SUBMIT_PAYPAL;
  paymentResponse: any;
  chargeAmount = 55.55;
  

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  @ViewChild('cardInfoWallet', { static: false }) cardInfoWallet: ElementRef;
  @ViewChild('checkout', { read: NgForm }) form: NgForm;
  @ViewChild('paypal', {read: ElementRef}) paypalButton: ElementRef<HTMLElement>;
  constructor(private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
    private sharedService: SharedService,
    private cd: ChangeDetectorRef,
    private stripeService:AngularStripeService,
    private formBuilder: FormBuilder) { 

      this.applyCouponForm=this.formBuilder.group({
        coupon:['',[Validators.required,Validators.pattern('^[A-Z0-9]*'),Validators.minLength(5),Validators.maxLength(10)]],
      });

  }

  ngOnInit(): void {
    // if(!this.sharedService.bookingSession){
    //   // this.router.navigateByUrl("/")
    //   this.sharedService.bookingSession=JSON.parse(localStorage.getItem('booking') || '{}')
    // }else{
    //   localStorage.setItem('booking',JSON.stringify(this.sharedService.bookingSession))
    // }
    if(!this.sharedService.bookingSession || !this.sharedService.bookingSession.bookingResponse){
      this.router.navigateByUrl("/booking/booking-history",{ replaceUrl: true })
      return
    }
    this.bookingInfo=this.sharedService.bookingSession
    this.pricing=this.bookingInfo.newPricing;
    this.getSavedCards();
    this.getWalletBalance();
    this.initPaypal();
    this.applyWallet(false);
    
  }

  ngAfterViewInit() {
    this.stripeService.setPublishableKey(environment.stripeKey).then(
      stripe=> {
        this.stripe = stripe;
        console.log(stripe)
        const elements = stripe.elements();    
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        // this.card.mount(this.cardInfoWallet.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
        this.selectedMethord=this.card;
        console.log(this.form)
    });
  }

  getSavedCards(){
    let stripeCustId=this.sharedService.getUserDetails().stripeCustId
    if(!stripeCustId){
      return
    }
    this.apiService.post(environment.baseURL + "get-payment-methords",{ id : stripeCustId} )
        .subscribe(
          resp => {
            console.log(resp)
            this.savedCards=resp.data;
          }
        );
  }

  getFormValid():boolean{
    if(this.selectedMethord==this.card){
      return this.error==null
    }else if(this.selectedMethord=='paypal'){
      return this.braintreeError==null
    }else if(this.cardDisabled){
      return true
    }else if(this.selectedMethord && this.selectedMethord.id){
      return true
    }
    return false
  }

  getWalletBalance(){
    if(!this.sharedService.getUserDetails()){
      return
    }
    let reqObj={
      user_id: this.sharedService.getUserDetails()?this.sharedService.getUserDetails().user_id:null
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_WALLET_BALANCE,reqObj)
      .subscribe(
        (data) => {
          console.log(data);
          this.walletBalance=data.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    if(this.card){
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
    
  }

  onChange(event:any) {
    console.log(this.selectedMethord)
    if (event.complete) {
      this.error = null;
    } else if (event.empty) {
      this.error = 'Please enter card details';
    }else if(event.error){
      this.error = event.error.message;
    }
    this.cd.detectChanges();
  }

  async onSubmit() {

    // const { token, error } = await this.stripe.createToken(this.card);

    // if (error) {
    //   console.log('Error:', error);
    // } else {
    //   console.log('Success!', token);
      
    // }
    if(this.selectedMethord=='paypal'){
      this.pay();
    }else if(this.cardDisabled){
      this.payWithWallet()
    }else{
      console.log(this.selectedMethord)
      let reqObj=this.bookingInfo.booking;
      reqObj.user_id=this.sharedService.getUserDetails().user_id;
      reqObj.customer_id='cus_L4D9bMUKWTLj6w'
      reqObj.saveFutureUses=true
      reqObj.booking_id=this.bookingInfo.bookingResponse.booking_id
      if(this.selectedMethord.id){
        reqObj.saveFutureUses=false;
      }
      if(this.isCouponApplied){
        reqObj.coupon_code=this.couponCode;
      }else{
        delete reqObj['coupon_code']
      }
      if(this.wallet){
        reqObj.payment_method=4;
      }else{
        reqObj.payment_method=1
      }
      this.isProcessingPayment=true
      this.apiService.post(environment.baseURL + ApiEndpoints.GET_PAYMENT_INTENT,reqObj )
      .subscribe(
        resp => {
          console.log(resp)
          this.onTokenSuccess(this.stripe,this.selectedMethord,resp.data.pi_id)
        },
        error=>{
          this.isProcessingPayment=false
        }
      );
    }

    
    
    
  }

  onTokenSuccess(stripe:any, card:any, clientSecret:any){
    if(card.id){
      this.apiService.showSpinner()
      this.stripe.confirmCardPayment(clientSecret, {
        payment_method: card.id
      })
      .then((result:any)=>{
        this.apiService.hideSpinner()
        if (result.error) {
          // Show error to your customer
          console.log(result.error.message);
        } else {
          // The payment succeeded!
          console.log(result.paymentIntent.id);
          

        }
      });
    }else{
      this.apiService.showSpinner()
      this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card
        }
      })
      .then((result:any)=>{
        this.apiService.hideSpinner()
        // if (result.error) {
        //   // Show error to your customer
        //   console.log(result.error.message);
        //   console.log(result.paymentIntent.id);
        // } else {
        //   // The payment succeeded!
        //   console.log(result.paymentIntent.id);
          
        // }
        this.submitPayment(result.paymentIntent.id)
      }).catch((err:any)=>{
        this.error=err.message
        this.isProcessingPayment=false
      });
    }
    
  }

  submitPayment(id:any){
    let reqObj=this.bookingInfo.booking;
    reqObj.user_id=this.sharedService.getUserDetails().user_id; 
    reqObj.pi_id=id
    reqObj.booking_id=this.bookingInfo.bookingResponse.booking_id
    if(this.isCouponApplied){
      reqObj.coupon_code=this.couponCode;
    }else{
      delete reqObj['coupon_code']
    }

    this.apiService.post(environment.baseURL + ApiEndpoints.SUBMIT_PAYMENT,reqObj )
      .subscribe(
        resp => {
          console.log(resp)
          this.sharedService.bookingSession=null
          // this.router.navigateByUrl('/guest')
          this.router.navigateByUrl("booking/detail/"+btoa(this.bookingInfo.bookingResponse.booking_id));
        },
        error=>{
          this.isProcessingPayment=false
        }
      );
  }

  initPaypal(){
    braintree.client.create({
      authorization: environment.braintree_key
    }, (clientErr:any, clientInstance:any)=> {
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

      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'font-size': '14px',
            'height':'auto'

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
        if(!this.cardDisabled)
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

  checkValidity(event:any){
    if(!event.fields.number.isValid){
      this.braintreeError="Please enter a valid card number"
    }else if(!event.fields.expirationDate.isValid){
      this.braintreeError="Please enter a valid date"
    }else if(!event.fields.cvv.isValid){
      this.braintreeError="Please enter a valid cvv"
    }else{
      this.braintreeError=null
    }
  }

  findLabel(field: any) {
    return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
  }

  pay(){
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
    this.hostedFieldsInstance.tokenize({cardholderName: this.cardholdersName}).then((payload) => {
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
      this.payWithPayPal(payload.nonce)
    }).catch((error) => {
      console.log(error);
      // perform custom validation here or log errors
    });
  }

  payWithPayPal(nonce:any){
    let reqObj=this.bookingInfo.booking;
    reqObj.nonce=nonce;
    reqObj.user_id=this.sharedService.getUserDetails().user_id; 
    reqObj.booking_id=this.bookingInfo.bookingResponse.booking_id;
    // reqObj.payment_method=2
    if(this.wallet){
      reqObj.payment_method=5;
    }else{
      reqObj.payment_method=2
    }

    this.apiService.post(environment.baseURL + ApiEndpoints.SUBMIT_PAYPAL,reqObj )
      .subscribe(
        resp => {
          console.log(resp)
          this.sharedService.bookingSession=null
          this.router.navigateByUrl('/guest')

        }
      );
  }

  payWithWallet(){
    let reqObj=this.bookingInfo.booking;
    reqObj.user_id=this.sharedService.getUserDetails().user_id; 
    reqObj.booking_id=this.bookingInfo.bookingResponse.booking_id;
    reqObj.payment_method=3

    this.apiService.post(environment.baseURL + ApiEndpoints.SUBMIT_WALLET_PAYMENT,reqObj )
      .subscribe(
        resp => {
          console.log(resp)
          this.sharedService.bookingSession=null
          this.router.navigateByUrl('/guest')
        }
      );
  }

  applyWallet(apply:any){
    let reqObj=this.bookingInfo.booking;
    reqObj.user_id=this.sharedService.getUserDetails().user_id; 
    reqObj.booking_id=this.bookingInfo.bookingResponse.booking_id
    reqObj.wallet=apply?1:0
    if(this.isCouponApplied){
      reqObj.coupon_code=this.couponCode;
    }else{
      delete reqObj['coupon_code']
    }
    this.apiService
      .post(environment.baseURL + ApiEndpoints.APPLY_WALLET, reqObj)
      .subscribe((data: any) => {
        console.log('data', data);
        this.remainingAmount=data.data.remaining_payout;
        this.cardDisabled=data.data.wallet_full_payment;
        this.selectedMethord=null;
        this.selectedMethordWallet=null;
      });

  }

  onWalletChange(event:any){
    console.log(event.currentTarget.checked)
    this.applyWallet(event.currentTarget.checked)

  }

  openPaymentPopup(){
    if(!this.amount){
      return
    
    }
    // $('#add_to_wallet').show()
    //jQuery\.noConflict\(\);
    $('#add_to_wallet').modal('show'); 
  }

  get couponControl () {
    return this.applyCouponForm.controls
  }

  applyCoupon(){
    if(this.applyCouponForm.get('coupon')==null){
      return
    }
    
    let reqObj=this.bookingInfo.booking
    reqObj.user_id=this.sharedService.getUserDetails().user_id;
    reqObj.coupon_code=this.applyCouponForm.get('coupon')?.value;
  
    this.apiService.post(environment.baseURL + ApiEndpoints.APPLY_COUPON,reqObj )
      .subscribe(
        (resp) => {
          console.log(resp)
          this.isCouponApplied=true;
          this.couponCode=this.applyCouponForm.get('coupon')?.value;
          this.pricing=resp.data
          document.getElementById('closeReferModel')?.click();
          this.applyWallet(this.wallet);
        },(error) => {
          this.bookingError=error.message
          this.couponCode=''
          this.pricing=this.bookingInfo.newPricing
          console.log(error);
          this.isCouponApplied=false;
          this.applyWallet(this.wallet);
        }
      );
  }

  removeCoupon(){
    this.isCouponApplied=false;
    this.pricing=this.bookingInfo.newPricing;
    this.applyWallet(this.wallet);
  }

  onDropinLoaded(event: any) {
    console.log('dropin loaded...');
    console.log(event);
    
  }

  onPaymentStatus(response: any): void {
    this.paymentResponse = response;
    console.log(this.paymentResponse);
  }
  


}

