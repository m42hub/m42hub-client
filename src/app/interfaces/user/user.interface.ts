export interface SystemRole {
  id: number;
  name: string;
  description: string;
  permissions: any[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  systemRole: SystemRole;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  roleId: number;
  roleName: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}
