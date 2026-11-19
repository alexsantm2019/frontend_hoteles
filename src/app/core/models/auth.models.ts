export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  user: User;
}

export interface RefreshResponse {
  access: string;
}
