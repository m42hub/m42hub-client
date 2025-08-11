import { AuthenticatedUser } from "../user/user.interface";

export interface ProjectMember {
  id: number;
  isManager: boolean;
  project: number;
  role: number;
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
