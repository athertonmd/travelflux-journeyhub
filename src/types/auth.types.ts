
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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, agencyName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSetupStatus: () => Promise<boolean>;
  updateSetupStatus: (completed: boolean) => Promise<boolean>;
  refreshSession: () => Promise<User | null>;
};
