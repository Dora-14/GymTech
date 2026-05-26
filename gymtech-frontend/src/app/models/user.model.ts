export interface UserAccount {
  userId: number;
  username: string;
  passwordHash: string;
  email: string;
  role: string;
}

export interface CreateUserRequest {
  username: string;
  passwordHash: string;
  email: string;
  role: string;
}
