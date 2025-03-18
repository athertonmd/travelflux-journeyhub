
export interface ContactMethod {
  type: 'telephone' | 'email' | 'sms' | 'web';
  value: string;
  linkUrl?: string;
}

export interface Contact {
  id: string;
  title: string;
  methods: ContactMethod[];
  details: string;
}

export interface OnboardingFormData {
  userName?: string;
  products: {
    mobile: boolean;
    documentDelivery: boolean;
    riskManagement: boolean;
  };
  gdsProvider: string;
  gdsConfig: {
    // Common fields
    endpoint?: string;
    apiKey?: string;
    pcc?: string;
    email?: string;
    // Sabre fields
    pccList: string;
    queueNumber: string;
    sabreQueueAssignment: string;
    fnbtsEntry: string;
    // Email integration fields
    emailForward?: string;
    emailTemplate?: string;
    // Credentials
    username?: string;
    password?: string;
    // Travelport fields
    tmcPccList: string;
    tripscapeGwsQueue: string;
    manticPointPcc: string;
    manticPointQueue: string;
  };
  selectedTripTiles: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
    logoUrl?: string;
  };
  contactInfo: {
    blurb: string;
    contacts: Contact[];
  };
  alertCountries: string[];
  tripBriefsEnabled?: boolean;
  alertEmail?: string;
}
