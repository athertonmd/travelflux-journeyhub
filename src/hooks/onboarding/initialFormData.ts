
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
    endpoint: '',
    apiKey: '',
    pcc: '',
    email: '',
    pccList: '',
    queueNumber: '',
    sabreQueueAssignment: '',
    fnbtsEntry: '',
    tmcPccList: '',
    tripscapeGwsQueue: '',
    manticPointPcc: 'RI7', // Default value for Travelport
    manticPointQueue: ''
  },
  selectedTripTiles: [],
  branding: {
    primaryColor: '#1EAEDB',
    secondaryColor: '#0FA0CE',
    logo: null,
    logoUrl: undefined
  },
  contactInfo: {
    blurb: 'We are here to help. Please use any of the contact details below.',
    contacts: []
  },
  alertCountries: [],
  tripBriefsEnabled: false,
  alertEmail: ''
};
