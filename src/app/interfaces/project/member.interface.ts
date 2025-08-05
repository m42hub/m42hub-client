import { AuthenticatedUser } from "../user/user.interface";

export interface ProjectMember {
  id: number;
  isManager: boolean;
  project: number;
  role: number;
  user: AuthenticatedUser;
  memberStatus: ProjectMemberStatus;
  applicationMesage: string | null;
}

export interface CreateProjectMember {
  isManager: boolean;
  projectId: number;
  roleId: number;
  userId: number;
  applicationMesage: string | null;
}

export interface ProjectMemberStatus {
  id: number;
  name: string;
  description?: string;
}
