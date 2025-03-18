
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
    apiKey: '',
    endpoint: '',
    pcc: '',
    email: '',
    pccList: '',
    queueNumber: '',
    sabreQueueAssignment: '',
    fnbtsEntry: '',
    emailForward: '',
    emailTemplate: '',
    username: '',
    password: '',
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
    logo: undefined as unknown as File,
    logoUrl: undefined,
  },
  contactInfo: {
    blurb: '',
    contacts: []
  }
};
