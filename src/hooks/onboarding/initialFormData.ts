
import { OnboardingFormData } from '@/types/onboarding.types';

export const initialFormData: OnboardingFormData = {
  userName: '',
  products: {
    mobile: false,
    documentDelivery: false,
    riskManagement: false
  },
  gdsProvider: '',
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
  },
  contactInfo: {
    blurb: '',
    contacts: []
  }
};
