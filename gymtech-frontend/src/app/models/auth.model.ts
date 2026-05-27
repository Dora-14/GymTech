export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  username: string;
  role: string;
  userId: number;
  memberId?: number;
  trainerId?: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
  role: string;
  memberId: number;
}
