export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse{
  user: User;
}

export interface SystemRole {
  id: number;
  name: string;
  description: string;
  permissions: any[];
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  systemRole: SystemRole;
}
