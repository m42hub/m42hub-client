export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
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
