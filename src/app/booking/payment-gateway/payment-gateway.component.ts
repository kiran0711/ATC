import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import  { NgForm } from "@angular/forms"
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service'
import { environment } from 'src/environments/environment';
import * as braintree from 'braintree-web';

import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { de } from 'date-fns/esm/locale';



@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  @ViewChild('paypal', {read: ElementRef}) paypalButton: ElementRef<HTMLElement>;
  // paypalButton = document.querySelector('.paypal-button');

  stripe:any;
  loading = false;
  confirmation:any;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: any;

  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;
  paypalInstance:any;

  constructor(
    private cd: ChangeDetectorRef,
    private stripeService:AngularStripeService,
    private apiService: ApiService) {}

  ngAfterViewInit() {
    this.stripeService.setPublishableKey(environment.stripeKey).then(
      stripe=> {
        this.stripe = stripe;
        console.log(stripe)
    const elements = stripe.elements();    
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
    });
    
    this.initPaypal()
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange(error:any) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    // const { token, error } = await this.stripe.createToken(this.card);

    // if (error) {
    //   console.log('Error:', error);
    // } else {
    //   console.log('Success!', token);
      
    // }
    let reqObj={customerId:'cus_L4D9bMUKWTLj6w',saveFutureUses:true}
    this.apiService.post("http://localhost:4242/" + "create-payment-intent",reqObj )
    .subscribe(
      resp => {
        console.log(resp)
        this.onTokenSuccess(this.stripe,this.card,resp.clientSecret)
      }
    );
    
  }
  
  initPaypal(){
    braintree.client.create({
      authorization: "sandbox_zjjfw38n_2x64xwx3xpsscw83"
    }, (clientErr:any, clientInstance:any)=> {
      if (clientErr) {
        console.log('Error creating client:', clientErr);
        return;
      }
    
      braintree.paypal.create({
        client: clientInstance
      }, (paypalErr:any, paypalInstance:any) =>{
        if (paypalErr) {
          console.log('Error creating PayPal:', paypalErr);
          return;
        }
    
        this.paypalButton.nativeElement.removeAttribute('disabled');
        this.paypalInstance=paypalInstance;

      });
    });
  }

  pay(){
    this.paypalInstance.tokenize({
      flow: 'vault'
      // For more tokenization options, see the full PayPal tokenization documentation
      // https://braintree.github.io/braintree-web/current/PayPal.html#tokenize
    }, (tokenizeErr:any, payload:any)=>{
      if (tokenizeErr) {
        if (tokenizeErr.type !== 'CUSTOMER') {
          console.log('Error tokenizing:', tokenizeErr);
        }
        return;
      }

      // Tokenization succeeded
      this.paypalButton.nativeElement.setAttribute('disabled', "true");
      console.log('Got a nonce! You should submit this to your server.');
      console.log(payload.nonce);
    });
  }

  onTokenSuccess(stripe:any, card:any, clientSecret:any){
    this.apiService.showSpinner()
    this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
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
  }

  getPaymentDetail(id:any){
    let paymentIntent={id:id};
    this.apiService.post("http://localhost:4242/" + "get-payment-intent",paymentIntent )
        .subscribe(
          resp => {
            console.log(resp)
          }
        );
  }
}
