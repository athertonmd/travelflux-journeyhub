
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

export interface AgencyInfo {
  name: string;
  address: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Subscription {
  tier: 'free' | 'paid' | 'enterprise';
  credits: number;
  autoRenew: boolean;
  autoRenewThreshold: number;
}

export interface OnboardingFormData {
  userName?: string;
  agencyInfo: AgencyInfo;
  products: {
    mobile: boolean;
    documentDelivery: boolean;
    riskManagement: boolean;
  };
  subscription: Subscription;
  gdsProvider: string;
  pnrIntegration: {
    method: 'api' | 'email' | 'manual';
  };
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
    termsAndConditionsUrl?: string;
    brandingGuidelinesUrl?: string;
  };
  contactInfo: {
    blurb: string;
    contacts: Contact[];
  };
  alertCountries: string[];
  tripBriefsEnabled?: boolean;
  alertEmail?: string;
}
