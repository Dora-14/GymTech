export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  userId: number;
  firstName: string;
  email: string;
}
