export interface ProjectMemberSimplified {
  id: number;
  isManager: boolean;
  project: number;
  role: number;
  user: number;
}

export interface CreateProjectMember {
  isManager: boolean;
  projectId: number;
  roleId: number;
  userId: number;
}
