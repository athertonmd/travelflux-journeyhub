
export interface Traveler {
  id: string;
  name: string;
  email: string;
  clientName: string;
  phoneNumber: string;
  enrolledDate: string;
  isMobileUser: boolean;
  recordLocator: string;
}

export interface TravelerFilters {
  name: string;
  email: string;
  clientName: string;
  phoneNumber: string;
  isMobileUser: string;
  recordLocator: string;
}
