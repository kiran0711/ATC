export const API_KEY = 'AIzaSyCZrIUBGN0aJOY6pRWnpkgISJ5bFMaKDwE';
export const DOB_FORMAT = 'MM-DD-YYYY';
export const DOB_API_FORMAT = 'YYYY-MM-DD';

export const USER_TYPE = { GUEST: 1, HOST: 2, GUEST_AND_HOST: 3 };
export const USER_PROFILE = { STUDENT: 1, PROFESSIONAL: 2, TRAVELLER: 3 };

export const ROLE = 'role';
export const USER_DATA = 'userdata';
export const AUTH_TOKEN = 'authToken';
export const GUEST = 'guest';
export const HOST = 'host';
export const LANGUAGES = [
  {
    label: 'English',
    code: 'en',
    img: './assets/images/canada.png',
    country: 'USA',
  },
  {
    label: 'français',
    code: 'fr',
    img: './assets/images/fr.png',
    country: 'France',
  },
  { label: 'Española', code: 'es', img: './assets/images/es.png', country: 'Spain' },
  { label: '中国人', code: 'zh', img: './assets/images/zh.png', country: 'China' },
  { label: 'Simplified Chinese', code: 'zh', img: './assets/images/zh.png', country: 'China' },
  { label: 'Deutsch', code: 'de', img: './assets/images/de.png', country: 'Germany' },
  { label: 'عربي', code: 'ar', img: './assets/images/ar.png', country: 'UAE' },
  { label: 'русский', code: 'ru', img: './assets/images/ru.png', country: 'Russia' },
  { label: 'Polskie', code: 'pl', img: './assets/images/pl.png', country: 'Poland' },
  { label: 'Italiana', code: 'it', img: './assets/images/it.png', country: 'Italy' },
];

export const USER_PERSPECTIVE = {
  NULL: 'null',
  GUEST: 'guest',
  HOST: 'host',
};

export const COUNTRIES = [
  {
    key: 'IN',
    label: 'India',
  },
  {
    key: 'CA',
    label: 'CANADA',
  },
  {
    key: 'US',
    label: 'USA',
  }
];

export const COUNTRY_CODES = [
  { value: '+1', label: '+1' },
  { value: '+91', label: '+91' },
  { value: '+60', label: '+60' }
];

export const ATTRIBUTES = [
  {
    key: 'bedrooms',
    ID: '1',
    label: 'Bedrooms',
  },
  {
    key: 'beds',
    ID: '2',
    label: 'Beds',
  },
  {
    key: 'baths',
    ID: '3',
    label: 'Baths',
  },
  {
    key: 'allow_sharing',
    ID: '4',
    label: 'Allow Sharing',
  },
  {
    key: 'guests_allowed',
    ID: '5',
    label: 'Guest Allowed',
  },
  {
    key: 'pets',
    ID: '6',
    label: 'Pets',
  },
  {
    key: 'children_allowed',
    ID: '7',
    label: 'Children Allowed',
  },
  {
    key: 'smoking',
    ID: '8',
    label: 'Smoking',
  },
  {
    key: 'instant_booking',
    ID: '9',
    label: 'Instant Booking',
  },
  {
    key: 'set_min_stay',
    ID: '10',
    label: 'Set Minimum Stay',
  },
  {
    key: 'min_stay_in_days',
    ID: '11',
    label: 'Minimum Stay(In days)',
  },
  {
    key: 'additional_guest_allow',
    ID: '12',
    label: 'Allow Additional Guest',
  },
  {
    key: 'max_additional_guest_allow',
    ID: '13',
    label: 'Max Additional Guest Allow',
  },
  {
    key: 'guest_notify_before_arrive',
    ID: '14',
    label: 'Do You Need The Guest To Notify You Before The Arrive?',
  },
  {
    key: 'party_allowed',
    ID: '15',
    label: 'Party Allowed',
  },
];

export const TIME = [
  {
    text: '00:00 AM',
    value: '00:00 AM',
  },
  {
    text: '1:00 AM',
    value: '1:00 AM',
  },
  {
    text: '2:00 AM',
    value: '2:00 AM',
  },
  {
    text: '3:00 AM',
    value: '3:00 AM',
  },
  {
    text: '4:00 AM',
    value: '4:00 AM',
  },
  {
    text: '5:00 AM',
    value: '5:00 AM',
  },
  {
    text: '6:00 AM',
    value: '6:00 AM',
  },
  {
    text: '7:00 AM',
    value: '7:00 AM',
  },
  {
    text: '8:00 AM',
    value: '8:00 AM',
  },
  {
    text: '9:00 AM',
    value: '9:00 AM',
  },
  {
    text: '10:00 AM',
    value: '10:00 AM',
  },
  {
    text: '11:00 AM',
    value: '11:00 AM',
  },
  {
    text: '12:00 PM',
    value: '12:00 PM',
  },
  {
    text: '1:00 PM',
    value: '1:00 PM',
  },
  {
    text: '2:00 PM',
    value: '2:00 PM',
  },
  {
    text: '3:00 PM',
    value: '3:00 PM',
  },
  {
    text: '4:00 PM',
    value: '4:00 PM',
  },
  {
    text: '5:00 PM',
    value: '5:00 PM',
  },
  {
    text: '6:00 PM',
    value: '6:00 PM',
  },
  {
    text: '7:00 PM',
    value: '7:00 PM',
  },
  {
    text: '8:00 PM',
    value: '8:00 PM',
  },
  {
    text: '9:00 PM',
    value: '9:00 PM',
  },
  {
    text: '10:00 PM',
    value: '10:00 PM',
  },
  {
    text: '11:00 PM',
    value: '11:00 PM',
  },
];

export const CURRENCY_FORMAT = 'USD'
//EUR

export const localStorageKeys = {
  signUpModelClose: 'sign_up_model_close',
};

export const AUTO_LOGOUT_MINUTES = 30;
export const domain = {
  text: ' podsliving.ca ',
  link: 'https://podsliving.ca/'
};



export const leaseDurations: any = [
  { value: 3, text: '3 Months' },
  { value: 6, text: '6 Months' },
  { value: 9, text: '9 Months' },
  { value: 12, text: '12 Months' },
  { value: 1, text: 'Month to Month' }
]


export const Earning_Member_Status: any = ['Salaried', 'Self Employed', 'New Immigrant', 'Other'];

export const Credit_Score_List = [
  {
    value: 'C', label: 'Below - 500'
  },
  {
    value: 'B', label: '500 - 680'
  },
  {
    value: 'B+', label: '501 - 680'
  },
  {
    value: 'A', label: '681 - 750'
  },
  {
    value: 'A+', label: '750 - Above'
  }
];









export const METADATA = [
  {
    url: 'whistler',
    title: 'Top Luxury Vacational Rental Property | Whistler Vacation Rental',
    // keywords:'Short Term Rental, Rental Property',
    description: 'Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of whistler, Canada.'
  },
  {
    url: 'niagara-falls',
    title: 'Niagara Falls Vacation Rentals | Short-term Home or Property Lease',
    description: 'Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of Niagara falls.'
  },
  {
    url: 'british-columbia',
    title: 'Vacation Houses For Rent in British Columbia | Vacation Rental',
    description: 'Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of British Columbia.'
  },
  {
    url: 'butchart-gardens',
    title: 'Butchart Garden Apartments, Condos & House For Vacation Rentals',
    description: 'Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of Butchart Garden.'
  },
  {
    url: 'st-john-s',
    title: "St. John's Vacation Property | Short-term Owner Accommodation",
    description: "Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of St. John's."
  },
  {
    url: 'quebec-city',
    title: "Homestay, Holiday Rental Property | Short/Long-Term Vacation Rental",
    description: "Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of Quebec City."
  },
  {
    url: 'old-montreal',
    title: "Old Montreal Apartments, Condos & Home For Vacation Rentals",
    description: "Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of Old Montreal."
  },
  {
    url: 'algonquin-provincial-park',
    title: "Vacation Rental Vacation Home & Property Algonquin Provincial Park",
    description: "Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of Algonquin Provincial Park."
  },
  {
    url: 'gros-morne-national-park',
    title: "Gros Morne National Park Vacation Rental | Short-Term Property Lease",
    description: "Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property in nearby area of Gros Morne National Park."
  },






  {
    url: 'simon-fraser-university',
    title: "Vacation Rental Near Tofino Vue | Lease Property Accommodation",
    description: "If you are looking for a vacation rental in Tofino, BC, we have what you need. We offer luxurious accommodations with spectacular ocean views and an easy-going atmosphere."
  },
  {
    url: 'st-peter-s-college',
    title: "Saint Peter's College Off-Campus Housing & Apartments",
    description: "Saint Peter's College Off-Campus Housing and Apartments is a student housing company that offers fully furnished apartments with high speed wi-fi, utilities, and parking."
  },
  {
    url: 'western-academy-broadcasting-college',
    title: "Student Accommodation & Housing Services- Saskatoon Rentals",
    description: "We have a wide selection of short-term or long-term rental apartments, condos, home and townhouses in Saskatoon near Western Academy Broadcasting College."
  }, {
    url: 'southeast-regional-college',
    title: "Off-Campus Rental Property Near Southeast Regional College",
    description: "Whether you are looking for a home near Southeast Regional College or a rental property, we have something for everyone. Compare rentals, see map views & choose your favourite one."
  }, {
    url: 'saskatchewan-institute-of-applied-sciences-and-technology',
    title: "Rental Property Near Saskatchewan Institute | Apartment, House, Condo",
    description: "Find your perfect Saskatchewan Institute rental property today. We offer a wide range of rental properties including houses, condos, apartments, and townhouses."
  },
  {
    url: 'skatchewan-indian-institute-of-technologies',
    title: "Rental Property Near Saskatchewan Indian Institute of Technologies",
    description: "Looking for a high-end residential rental property near Saskatchewan Indian Institute of Technologies? View our available rentals and end your search today."
  },
  {
    url: 'north-west-regional-college',
    title: "North West Regional College Off Campus Student Housing Apartment",
    description: "North West Regional College rental property & off-campus living accommodation at best price for students attending colleges, universities and trade schools."
  },
  {
    url: 'northlands-college',
    title: "Off-Campus Housing & Apartments | Rental Property Near Northland College",
    description: "Pods Living offers lease apartment, independent home, condos, lofts, Airbnb or office space for short-term or long-term vacation rental property nearby area of northland college."
  },
  {
    url: 'nipawin-bible-college',
    title: "Student Accommodation & Housing Services Near Nipawin Bilble College",
    description: "Looking for rental property or apartment near Nipawin bible college for short term or long term? Visit us compare rentals see location and choose according to budget."
  },
  {
    url: 'great-plains-college',
    title: "Rental Apartment, House, Condo Near Great Plain College",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near great plain college at affordable price."
  },
  {
    url: 'eston-college',
    title: "Vacation Rental Near Eston College | Off-Campus Accommodation",
    description: "We have a wide selection of short-term or long-term rental apartments, condos, home and townhouses near Eston College for students."
  },
  {
    url: 'college-mathieu',
    title: "College Mathieu Off-Campus Housing  | Rental Property for Student",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near college Mathieu at affordable price."
  },
  {
    url: 'horizon-college-and-seminary',
    title: "Student Accommodation & Housing Services | Renatal Propert Horizon College",
    description: "Whether you are looking for a home near Horizon College & seminary or a rental property, we have something for everyone. Compare rentals, see map views & choose your favourite one."
  },
  {
    url: 'carlton-trail-regional-college',
    title: "Off-Campus Rental Property Near Carlton Trail Regional College",
    description: "Carlton Trail Regional College Off-Campus Housing and Apartments is a student housing company that offers fully furnished apartments with high speed wi-fi, utilities, and parking."
  },
  {
    url: 'briercrest-college-and-seminary',
    title: "Rental Property Near Briercrest College | Apartment, House, Rooms",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near Briercrest College & Seminary."
  },
  {
    url: 'university-of-regina',
    title: "Off-Campus Housing & Apartments | Rental Property Near Northland College",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near university of regina at affordable price."
  },
  {
    url: 'first-nations-university-of-canada',
    title: "Rental Houses for Students Near First Nations University of Canada",
    description: "If you're looking for safe & budget friendly off-campus student housing apartment near First Nations University, you've come to the right place."
  },
  {
    url: 'brandon-university',
    title: "Rental Apartment, House, Condo Near Brandon University",
    description: "We have a wide selection of short-term or long-term rental apartments, condos, home and off-campus housing near Brandon for students."
  },
  {
    url: 'manitoba-institute-of-trades-and-technology',
    title: "Manitoba Institute Off Campus Student Housing Apartment Rental",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near Manitoba Institute at affordable price."
  },
  {
    url: 'ecole-technique-et-professionnelle-universite-de-saint-boniface',
    title: "Off-Campus Housing | Rental Property Near Ecole Technique et Professionalle University",
    description: "Get the best rental place near Ecole Technique Et Professionnele university, either for short term or long term with all facilities."
  },
  {
    url: 'red-river-college-of-applied-arts-science-and-technology',
    title: "Student Accommodation & Housing Services Near Red River College",
    description: "Pods Living offers rental apartment, sharing rooms, off-campus housing, property for student near Red River College at affordable price in Canada."
  },
  {
    url: 'assiniboine-community-college',
    title: "Rental Apartment, House, Room Near Assiniboine College at Best Price",
    description: "If you are looking for a rental property near Assiniboine Community College, we have what you need. We offer luxurious accommodations with spectacular ocean views and an easy-going atmosphere."
  },
  {
    url: 'universite-de-saint-boniface',
    title: "Rental Service Near University De Saint Boniface | Off-Campus Accommodation",
    description: "Whether you are looking for a home near University De Saint Boniface or a rental property, we have something for everyone. Compare rentals, see map views & choose your favourite one."
  },
  {
    url: 'canadian-mennonite-university',
    title: "Canadian Mennonite University Off-Campus Housing  | Rental Property for Student",
    description: "We have a wide selection of short-term or long-term rental apartments, condos, home and off-campus housing near Canadian Mennonite University."
  },
  {
    url: 'university-of-winnipeg',
    title: "Rental Property Near University of Winnipeg | Student Home or Apartment",
    description: "University of winnipeg Off-Campus Housing and Apartments is a student housing company that offers fully furnished apartments with high speed wi-fi, utilities, and parking."
  },
  {
    url: 'university-of-manitoba',
    title: "Property Rental Near University of Manitoba | Off-Campus Accommodation",
    description: "If you are looking for a rental property near University of manitoba, we have what you need. We offer luxurious accommodations with spectacular ocean views and an easy-going atmosphere."
  },
  {
    url: 'vancouver-institute-of-media-arts',
    title: "Vancouver Institute Off-Campus Housing & Apartments | Rental Home",
    description: "Find your perfect rental property near Vancouver Institute today. We offer a wide range of rental properties including houses, condos, apartments, and off-campus housing."
  },
  {
    url: 'mount-royal-university',
    title: "Student Accommodation & Housing Services- Mount Royal University",
    description: "Get the best rental place near Mount Royal university, either for short term or long term with fully furnished apartments with high speed wi-fi, utilities and parking"
  },
  {
    url: 'https://podsliving.ca/properties/university/university-of-lethbridge',
    title: "Off-Campus Rental Property Near University of Lethbridge",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near college Mathieu at affordable price.Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near University of Lethbridge at affordable price."
  },
  {
    url: 'university-of-calgary',
    title: "Rental Property Near University of Calgary | Apartment, House, Condo",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near college Mathieu at affordable price.If you're looking for safe & budget friendly off-campus student housing apartment near University of Calagry, you've come to the right place."
  },
  {
    url: 'university-of-alberta',
    title: "Off-Campus Housing & Apartments | Rental Property Near University of Alberta",
    description: "Pods Living offers rental apartment, sharing rooms, off-campus housing, property for student near University of Alberta at affordable price in Canada."
  },
  {
    url: 'the-king-s-university-college',
    title: "Rental Apartment, House, Condo Near The Kings University College",
    description: "Find your perfect The kings university rental property today. We offer a wide range of rental properties including houses, condos, apartments, and off-campus housing."
  },
  {
    url: 'concordia-university-college-of-alberta',
    title: "Concordia University Off Campus Student Housing | Rentals Rooms",
    description: "Get the best rental place near Concordia University of Alberta, either for short term or long term with all facilities. Full accommodation with proper hygiene in apartment."
  },
  {
    url: 'augustana-university-college',
    title: "Students Rental Property | Off Campus Housing Near Augustana university",
    description: "Pods Living Off-Campus Housing and Apartments is a student housing company that offers fully furnished apartments with high speed wi-fi, utilities near Augustana University"
  },
  {
    url: 'athabasca-university',
    title: "Athabasca Off-Campus Housing & Apartments | Student Rentals",
    description: "Pods Living provides collection lease apartment, independent home, condos, sharing rooms, off-campus housing built for student near Athabasca University  at affordable price."
  },
  {
    url: 'university-of-british-columbia',
    title: "Student Accommodation & Housing Services Near University of BC",
    description: "If you're looking for safe & budget friendly off-campus student housing apartment, condos near University of British Columbia, you've come to the right place."
  },
  {
    url: 'camosun-college',
    title: "Off-Campus Rental Property Near Camosun College | Student Accommodation",
    description: "Find your perfect Camsoun Collegr rental property today. We offer a wide range of rental properties including houses, condos, apartments, and off-campus housing."
  },
  {
    url: 'columbia-college',
    title: "Student Accommodation & Housing Services near Columbia College",
    description: "Pods Living Off-Campus Housing and Apartments is a student housing company that offers fully furnished apartments with high speed wi-fi, utilities near Columbia College"
  },
]