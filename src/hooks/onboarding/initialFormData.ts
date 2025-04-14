
import { OnboardingFormData } from '@/types/onboarding.types';
import { v4 as uuidv4 } from 'uuid';

export const initialFormData: OnboardingFormData = {
  userName: '',
  agencyInfo: {
    name: '',
    address: '',
    website: '',
    contactEmail: '',
    contactPhone: ''
  },
  products: {
    mobile: false,
    documentDelivery: false,
    riskManagement: false
  },
  subscription: {
    tier: 'free',
    credits: 10,
    autoRenew: false,
    autoRenewThreshold: 0
  },
  gdsProvider: 'sabre',
  pnrIntegration: {
    method: 'api'
  },
  gdsConfig: {
    pccList: '',
    queueNumber: '',
    sabreQueueAssignment: '',
    fnbtsEntry: '',
    tmcPccList: '',
    tripscapeGwsQueue: '',
    manticPointPcc: '',
    manticPointQueue: ''
  },
  selectedTripTiles: [],
  branding: {
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    logo: null
  },
  contactInfo: {
    blurb: '',
    contacts: [
      {
        id: uuidv4(),
        title: 'Customer Support',
        methods: [
          { type: 'telephone', value: '' }
        ],
        details: ''
      }
    ]
  },
  alertCountries: [],
  tripBriefsEnabled: false,
  alertEmail: '',
  agencyGuide: {
    categories: []
  }
};
