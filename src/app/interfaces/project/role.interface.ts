export interface ProjectRole {
  id: number;
  name: string;
  description?: string;
}

export interface CreateProjectRole {
  name: string;
  description?: string;
}

export interface ProjectUnfilledRole {
  id: number;
  name: string;
  description?: string;
}
