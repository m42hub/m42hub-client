import { ProjectComplexity } from "./complexity.interface";
import { ProjectMember } from "./member.interface";
import { ProjectUnfilledRole } from "./role.interface";
import { ProjectStatus } from "./status.interface";
import { ProjectTool } from "./tool.interface";
import { ProjectTopic } from "./topic.interface";

export interface Project {
  id: number;
  name: string;
  summary: string;
  description: string;
  status?: ProjectStatus;
  complexity?: ProjectComplexity;
  imageUrl?: string;
  creationDate: string;
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
  status?: number;
}
