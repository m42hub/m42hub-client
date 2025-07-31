// Base interfaces for lookup tables
export interface ProjectStatus {
  id: number;
  name: string;
  description?: string;
}

export interface ProjectComplexity {
  id: number;
  name: string;
  description?: string;
}

export interface ProjectTool {
  id: number;
  name: string;
  hexColor?: string;
  description?: string;
}

export interface ProjectTopic {
  id: number;
  name: string;
  hexColor?: string;
  description?: string;
}

export interface ProjectRole {
  id: number;
  name: string;
  description?: string;
}

export interface ProjectMember {
  id: number;
  isManager: boolean;
  project: number;
  role: number;
  user: number;
}

export interface ProjectUnfilledRole {
  id: number;
  name: string;
  description?: string;
}

export interface Project {
  id: number;
  name: string;
  summary: string;
  description: string;
  status?: ProjectStatus;
  complexity?: ProjectComplexity;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  tools?: ProjectTool[];
  topics?: ProjectTopic[];
  members?: ProjectMember[];
  unfilledRoles?: ProjectUnfilledRole[];
}

export interface CreateProjectRequest {
  name: string;
  summary: string;
  description: string;
  statusId: number;
  complexityId: number;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  toolIds?: number[];
  topicIds?: number[];
  unfilledRoleIds?: number[];
  managerRoleId: number;
}

export interface UpdateProjectRequest {
  name?: string;
  summary?: string;
  description?: string;
  statusId?: number;
  complexityId?: number;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  toolIds?: number[];
  topicIds?: number[];
  unfilledRoleIds?: number[];
}

export interface ProjectSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  complexity?: number;
  tools?: number;
  topics?: number;
  unfilledRoles?: number;
  status?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
  };
}
