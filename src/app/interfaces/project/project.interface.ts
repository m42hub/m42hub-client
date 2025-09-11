import type { ProjectComplexity } from './complexity.interface';
import type { ProjectMember } from './member.interface';
import type { ProjectUnfilledRole } from './role.interface';
import type { ProjectStatus } from './status.interface';
import type { ProjectTool } from './tool.interface';
import type { ProjectTopic } from './topic.interface';

export interface Project {
  id: number;
  name: string;
  summary: string;
  description: string;
  status?: ProjectStatus;
  complexity?: ProjectComplexity;
  imageUrl?: string;
  discord?: string;
  github?: string;
  projectWebsite?: string;
  creationDate: string;
  startDate: string;
  endDate?: string;
  tools?: ProjectTool[];
  topics?: ProjectTopic[];
  members?: ProjectMember[];
  unfilledRoles?: ProjectUnfilledRole[];
}

export interface ProjectListItem {
  id: number;
  name: string;
  summary: string;
  statusName?: string;
  complexityName?: string;
  imageUrl?: string;
  discord?: string;
  github?: string;
  projectWebsite?: string;
  creationDate: string;
  startDate: string;
  endDate?: string;
  toolNames?: string[];
  topicNames?: string[];
  unfilledRoleNames?: string[];
  manager?: string;
}

export interface CreateProjectRequest {
  name: string;
  summary: string;
  description: string;
  statusId: number;
  complexityId: number;
  imageUrl?: string;
  discord?: string;
  github?: string;
  projectWebsite?: string;
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
  discord?: string;
  github?: string;
  projectWebsite?: string;
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
  complexity?: number | number[];
  tools?: number | number[];
  topics?: number | number[];
  unfilledRoles?: number | number[];
  status?: number | number[];
}
