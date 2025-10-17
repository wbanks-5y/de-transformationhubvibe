
import { Session, User, Provider } from '@supabase/supabase-js';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticating: boolean;
  userStatus: UserStatus;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Record<string, any>) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Record<string, any>) => Promise<void>;
  refreshSession: () => Promise<{ session: any; user: any; userStatus: UserStatus; } | null>;
}
