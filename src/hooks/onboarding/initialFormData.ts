
import { OnboardingFormData } from '@/types/onboarding.types';

export const initialFormData: OnboardingFormData = {
  userName: '',
  products: [],
  gdsProvider: '',
  gdsConfig: {
    apiKey: '',
    secretKey: '',
    endpointUrl: '',
    pccList: '',
    sabreQueueAssignment: '',
    queueNumber: '',
    fnbtsEntry: '',
    emailForward: '',
    emailTemplate: '',
    username: '',
    password: '',
  },
  selectedTripTiles: [],
  alertCountries: [],
  tripBriefsEnabled: false,
  alertEmail: '',
  branding: {
    primaryColor: '#1EAEDB',
    secondaryColor: '#0FA0CE',
    logoUrl: undefined,
  },
  contactInfo: {
    blurb: '',
    contacts: []
  }
};
