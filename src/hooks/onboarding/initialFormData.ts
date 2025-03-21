
import { OnboardingFormData } from '@/types/onboarding.types';

export const initialFormData: OnboardingFormData = {
  userName: '',
  agencyInfo: {
    name: '',
    address: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
  },
  products: {
    mobile: true,
    documentDelivery: false,
    riskManagement: false
  },
  subscription: {
    tier: 'free',
    credits: 10,
    autoRenew: false,
    autoRenewThreshold: 0
  },
  gdsProvider: '',
  pnrIntegration: {
    method: 'api', // 'api', 'email', 'manual'
  },
  gdsConfig: {
    // Common fields
    apiKey: '',
    endpoint: '',
    pcc: '',
    email: '',
    // Sabre fields
    pccList: '',
    queueNumber: '',
    sabreQueueAssignment: '',
    fnbtsEntry: '',
    // Email integration fields
    emailForward: '',
    emailTemplate: '',
    // Credentials
    username: '',
    password: '',
    // Travelport fields
    tmcPccList: '',
    tripscapeGwsQueue: '',
    manticPointPcc: '',
    manticPointQueue: '',
  },
  selectedTripTiles: [],
  alertCountries: [],
  tripBriefsEnabled: false,
  alertEmail: '',
  branding: {
    primaryColor: '#1EAEDB',
    secondaryColor: '#0FA0CE',
    logo: null,
    logoUrl: undefined,
    termsAndConditionsUrl: '',
    brandingGuidelinesUrl: '',
  },
  contactInfo: {
    blurb: '',
    contacts: []
  }
};
