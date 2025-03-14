
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
  authError: string | null;
  signUp: (name: string, email: string, password: string, agencyName?: string) => Promise<boolean>;
  logIn: (email: string, password: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  updateSetupStatus: (completed: boolean) => Promise<boolean>;
  refreshSession: () => Promise<User | null>;
  sessionChecked: boolean;
};
