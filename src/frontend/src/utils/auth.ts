import { getUserByEmail, getUserByPhone, addUser, setSession, clearSession, User } from './storage';

export interface LoginResult {
  success: boolean;
  error?: string;
  errorType?: 'unverified' | 'invalid';
  user?: User;
}

export interface SignupResult {
  success: boolean;
  error?: string;
  field?: string;
  verificationCode?: string;
  email?: string;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function login(identifier: string, password: string): LoginResult {
  if (!identifier.trim()) {
    return { success: false, error: 'Please enter your email or phone number.', errorType: 'invalid' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.', errorType: 'invalid' };
  }

  const isEmail = identifier.includes('@');
  const user = isEmail
    ? getUserByEmail(identifier)
    : getUserByPhone(identifier);

  if (!user) {
    return { success: false, error: 'No account found with that email or phone number.', errorType: 'invalid' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.', errorType: 'invalid' };
  }

  // Check verification status
  if (!user.verified) {
    return {
      success: false,
      error: 'Account not verified. Please verify your email before logging in.',
      errorType: 'unverified',
    };
  }

  setSession(user.id);
  return { success: true, user };
}

export function signup(
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): SignupResult {
  if (!name.trim()) {
    return { success: false, error: 'Please enter your full name.', field: 'name' };
  }
  if (!email.trim()) {
    return { success: false, error: 'Please enter your email address.', field: 'email' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.', field: 'email' };
  }
  if (!phone.trim()) {
    return { success: false, error: 'Please enter your phone number.', field: 'phone' };
  }
  if (!/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
    return { success: false, error: 'Please enter a valid phone number.', field: 'phone' };
  }
  if (!password) {
    return { success: false, error: 'Please enter a password.', field: 'password' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.', field: 'password' };
  }
  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.', field: 'confirmPassword' };
  }

  if (getUserByEmail(email)) {
    return { success: false, error: 'An account with this email already exists.', field: 'email' };
  }
  if (getUserByPhone(phone)) {
    return { success: false, error: 'An account with this phone number already exists.', field: 'phone' };
  }

  const verificationCode = generateVerificationCode();

  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password,
    createdAt: new Date().toISOString(),
    verificationCode,
    verified: false,
  };

  addUser(newUser);
  console.log(`[Email Simulation] Verification code for ${newUser.email}: ${verificationCode}`);

  return { success: true, verificationCode, email: newUser.email };
}

export function logout(): void {
  clearSession();
}
