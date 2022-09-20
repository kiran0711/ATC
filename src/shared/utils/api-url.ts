export const ApiEndpoints = {
  LOGIN: 'auth/login',
  GOOGLE_LOGIN: 'auth/login/google/callback',
  FACEBOOK_LOGIN: 'auth/login/facebook/callback',
  APPLE_LOGIN: 'auth/login/apple/callback',
  REGISTER: 'auth/register',
  LOGIN_OTP: 'auth/validate-login-otp',
  REGISTER_OTP: 'auth/validate-registration-otp',
  RESEND_OTP_LOGIN: 'auth/auth-resend-otp/login',
  RESEND_OTP_REGISTER: 'auth/auth-resend-otp/register',
  RESEND_OTP_RESET_PASSWORD: 'auth/auth-resend-otp/passwordreset',
  FORGOT_PASSWORD: 'auth/request-reset-password',
  RESET_PASSWORD: 'auth/reset-password',
  VERIFY_EMAIL: 'auth/resent-email-verification',

  //profile
  PROFILE_PIC_UPDATE: 'profile/save-profile-picture',
  GET_PROFILE_DETAIL: 'profile/my-profile',
  SAVE_PROFILE_INFO: 'profile/save-general-info',
  SAVE_CONTACT_INFO: 'profile/save-contact-info',
  SAVE_STUDENT_INFO: 'profile/save-student-info',
  SAVE_DOCUMENT_INFO: 'profile/save-document-info',
  CHANGE_PASSWORD: 'profile/change-password',
  UPDATE_EMAIL: 'profile/update-email',
  UPDATE_MOBILE: 'profile/update-phone',
  UPDATE_MOBILE_OTP_RESEND:'auth/auth-resend-otp/phoneupdate',
  UPDATE_MOBILE_OTP: 'profile/validate-phoneupdate-otp',
  POST_HST_NUMBER:'profile/update-hst',
  UPDATE_KYC: 'kyc/user/verify',
  GET_KYC_STATUS: 'kyc/user/verify-status',
  PAYOUT:'profile/host-payout-detail',

  // General
  SUBSCRIPTION: 'general/subscribe-email',
  WHAT_LOOKING_FOR: 'general/what-looking-for',
  CONTACT_US: 'general/save-contact-us',
  APPLY_FOR_WEBINAR:'general/apply-for-webinar',
  SUBSCRIBE_HOST_EMAIL:'general/subscribe-host-email',
  FAQ: 'general/faq',
  

  //Property
  CREATE_PROPERTY: 'property/create-property',
  GET_PROPERTY_TYPES: 'general/category-list',
  PROPERTY_STEP1: 'property/property-detail-step-1',
  PROPERTY_STEP2: 'property/property-detail-step-2',
  PROPERTY_STEP3: 'property/property-detail-step-3',
  PROPERTY_STEP4: 'property/property-detail-step-4',
  PROPERTY_STEP5: 'property/property-detail-step-5',
  PROPERTY_STEP6: 'property/property-detail-step-6',
  PROPERTY_STEP7: 'property/publish',
  PROPERTY_IMAGE_DELETE: 'property/property-image-delete',
  CANCELLATION_POLICY_LIST: 'general/cancel-policy-list',
  SAVE_CANCELLATION_POLICY: 'property/property-cancellation-policy',
  SAVE_AVAILABILITY: 'property/property-not-available-dates',
  


  PROPERTY_EDIT_STEP0: 'property/property-step0-get-data',
  PROPERTY_EDIT_STEP1: 'property/property-step1-get-data',
  PROPERTY_EDIT_STEP2: 'property/property-step2-get-data',
  PROPERTY_EDIT_STEP3: 'property/property-step3-get-data',
  PROPERTY_EDIT_STEP4: 'property/property-step4-get-data',
  PROPERTY_EDIT_STEP5: 'property/property-step5-get-data',
  PROPERTY_EDIT_STEP6: 'property/property-step6-get-data',

  EDIT_CANCELLATION_POLICY: 'property/property-cancellation-policy-get-data',

  SEASON_LIST: 'general/seasonal-list',
  PROPERTY_STEP_IMAGE_UPLOAD: 'property/property-upload-file',
  PROPERTY_IMAGE_LIST: 'auth/property-img-list',
  PROPERTY_STEP_IMAGE_UPDATE: 'property/property-image-update',
  ATTRIBUTES_LIST: 'general/attributes-list',
  AMENITIES: 'general/amenity-facility-list',

  GET_PROPERTY_LIST: 'general/property-list',
  GET_PROPERTY_LISTS: 'general/property-lists',
  
  GET_ATTRIBUTE_BY_CAT: 'general/attributes-list-By-categories',
  PROPERTY_DETAIL: 'general/property-detail',
  SERVICES_MASTER_LIST: 'general/amenity-facility-list',
  SEND_MSG_TO_PROP_HOST: 'auth/sendto-pro-msg',

  //Long Term Property
  longTermProperty:{
    CREATE_PROPERTY: 'property/longterm-create-property',
    PROPERTY_STEP1: 'property/longterm-property-detail-step-1',
    PROPERTY_STEP2: 'property/longterm-property-detail-step-2',
    PROPERTY_STEP3: 'property/longterm-property-detail-step-3',
    PROPERTY_PUBLISH: 'property/longterm-publish',

    PROPERTY_STEP_IMAGE_UPLOAD: 'property/longterm-property-upload-file',
    PROPERTY_STEP_IMAGE_UPDATE: 'property/longterm-property-image-update',
    PROPERTY_STEP_LEASING_DETAILS: 'property/longterm-property-leasing-details',
    GET_PROPERTY_DETAIL: 'property/longterm-property-detail-byid/',
    PROPERTY_IMAGE_DELETE: 'property/longterm-property-image-delete',
    ATTRIBUTES_LIST: 'general/longterm-attributes-list',
    GET_PROPERTY_LIST: 'general/longterm-property-list',
    GET_PROPERTY_LISTS: 'general/longterm-property-lists',
    PROPERTY_DETAIL: 'general/longterm-property-detail',

    BOOKING: 'booking/longterm-request-booking',

    GET_BOOKING_REQUESTS: 'booking/longterm-my-booking-requests',
    GET_BOOKING_REQUEST_DETAIL: 'booking/longterm-booking-request-detail',

    REJECT: 'booking/longterm-cancel-booking-request',
    SCHEDULE: 'booking/schedule-showing',
    SCHEDULE_SHOW: 'booking/showing-date-selection',
    RESCHEDULE: 'booking/reschedule-showing',

    CONFIRMATION: 'booking/property-viewing-confirmation',
    COMPLETION: 'booking/request-completion-steps',
    FILE_UPLOAD: 'booking/upload-verification-files',
    VERIFICATION: 'booking/document-verification',
    ADD_EARNING_MEMBER: 'booking/add-earning-member',
    REMOVE_EARNING_MEMBER: 'booking/remove-earning-member',
    VERIFY_LOGGEDIN_USER: 'booking/verify-loggedin-user',
    VERIFICATION_AMOUNT: 'booking/verification-amount-calculation',

    //payment
    SUBMIT_PAYPAL:'booking/longterm-confirm-btree-booking',

    APPLY_WALLET:'booking/longterm-apply-wallet-ballance',
    SUBMIT_WALLET_PAYMENT:'booking/longterm-confirm-wallet-booking',
  
    GET_PAYMENT_INTENT:'booking/longterm-stripe-payment-intent',
    SUBMIT_PAYMENT:'booking/longterm-confirm-stripe-book',
  

  },




  //Booking
  CHECK_BOOKING: 'general/checkBooking',

  //Change User Type to both
  CHANGE_USER_TYPE:'profile/update-role',

  LOGOUT: 'auth/logout',

  // PROPERTY API
  GET_PROPERTY_DETAIL: 'property/property-detail-byid/',

  //TOP DESTINATION BY CATEGORY
  GET_TOP_DESTINATION_BY_CATEGORY:'general/top-list-by-category',

  //career formm request
  CAREER_FORM: 'general/career-form',
  DASHBOARD_BOOKING_COUNT: 'booking/dashboard-booking-count',
  DASHBOARD_COUNT: 'dashboard/dashboard-count',

  //get Booking list
  GET_BOOKING_LIST: 'booking/my-bookings',
  //get Booking Requests
  GET_BOOKING_REQUESTS: 'booking/my-booking-requests',
  CHANGE_STATUS_REQUEST: 'booking/booking-request-action',
  GET_BOOKING_DETAIL: 'booking/booking-detail',
  GET_BOOKING_REQUEST_DETAIL: 'booking/booking-request-detail',
  GET_BOOKING_INVOICE: 'booking/invoice',
  CANCEL_BOOKING: 'booking/cancel-booking',
  //Get Invoices
  GET_INVOICES: 'booking/my-invoices',
  //Get Invoices
  GET_REFERALS: 'referral/get-referral-programs',
  INVITE_PEOPLE:'referral/invite-people',
  
  //Get Price Detail
  GET_PRICE_DETAIL:'general/get-booking-price',
  BOOK_NOW:'booking/book-now',
  REQUEST_BOOKING:'booking/request-booking',
  APPLY_COUPON:'booking/apply-coupon',
  //Get Wallet Balance
  GET_WALLET_BALANCE:'wallet/balance',
  CREATE_WALLET_PAYMENT_INTENT:'wallet/stripe/create-payment-intent',
  ADD_TO_WALLET:'wallet/addmoney',
  BRAINTREE_ADD_TO_WALLET:'wallet/btreeaddmoney',
  GET_WALLET_TRANSACTIONS:'wallet/transactions',
  
  //Stripe
  GET_PAYMENT_INTENT:'booking/stripe-payment-intent',
  SUBMIT_PAYMENT:'booking/confirm-stripe-book',
  APPLY_WALLET:'booking/apply-wallet-ballance',
  SUBMIT_WALLET_PAYMENT:'booking/confirm-wallet-booking',
  SUBMIT_PAYPAL:'booking/confirm-btree-booking',
  GET_PAYPAL_TOKEN:'booking/btree-token'
};

