import type { AuthenticatedUser } from '../user/user.interface';
import { ProjectListItem } from './project.interface';
import { ProjectRole } from './role.interface';

export interface ProjectMember {
  id: number;
  isManager: boolean;
  project: number;
  roleId: number;
  user: AuthenticatedUser;
  memberStatus: ProjectMemberStatus;
  applicationMessage: string | null;
  createdAt: string;
}

export interface ProjectMemberProject {
  id: number;
  isManager: boolean;
  projectListItem: ProjectListItem;
  role: ProjectRole;
  user: AuthenticatedUser;
  memberStatus: ProjectMemberStatus;
  applicationMessage: string | null;
  createdAt: string;
}

export interface ApplyProjectMember {
  isManager: boolean;
  projectId: number;
  roleId: number;
  applicationMessage: string | null;
}

export interface ProjectMemberStatus {
  id: number;
  name: string;
  description?: string;
}
