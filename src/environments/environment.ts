// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'https://admin.podsliving.com/api/',
  imageURL: 'https://admin.podsliving.com/',
  //baseURL1: 'https://admin.podsliving.ca/api/',
  // imageURL: 'https://admin.podsliving.ca/',
  recaptcha: {
    siteKey: '6LfEUY8cAAAAAKYE9s_6DkqKrMedTX3tqGfD7lN7',
    secretKey: '6LfEUY8cAAAAAJ_IKFlKdeIgxZ0_Cwy7PYjofPRO',
  },
  stripeKey:'pk_test_51IqoL5J4F3qNptXAQ3pCBDkVErhJOeXKtv6qAVF1JdoYYvLio3us7oFeGNK6Mgi1yuobTuW37arUCgFZ1hf89jOt00NAsBYYzR',
  braintree_key:'sandbox_tvy7mk35_ztnjg7mtx4smpv5g'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
