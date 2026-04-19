export type UserRole = 'student' | 'teacher' | 'parent';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}
