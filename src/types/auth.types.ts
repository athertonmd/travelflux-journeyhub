
export type User = {
  id: string;
  email: string;
  name: string;
  agencyName?: string;
  setupCompleted?: boolean;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, agencyName?: string) => Promise<void>;
  logout: () => void;
  checkSetupStatus: () => Promise<boolean>;
  updateSetupStatus: (completed: boolean) => Promise<void>;
};
