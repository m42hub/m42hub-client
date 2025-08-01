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
