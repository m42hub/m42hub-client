import { ProjectRole } from '../project/role.interface';

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
  profilePicUrl: string;
  profileBannerUrl: string;
  roleId: number;
  roleName: string;
}

export interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
  profilePicUrl: string;
  profileBannerUrl: string;
  roleId: number;
  roleName: string;
  biography: string;
  discord: string;
  linkedin: string;
  github: string;
  personalWebsite: string;
  interestRoles: ProjectRole[];
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface UserInfoRequest {
  firstName: string;
  lastName: string;
  biography: string;
  discord: string;
  linkedin: string;
  github: string;
  personalWebsite: string;
  interestRoles: number[];
}

export interface UserPasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}
