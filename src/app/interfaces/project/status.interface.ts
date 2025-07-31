export interface ProjectStatus {
  id: number;
  name: string;
  description?: string;
}

export interface CreateProjectStatus {
  name: string;
  description?: string;
}
