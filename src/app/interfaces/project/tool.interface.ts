export interface ProjectTool {
  id: number;
  name: string;
  description?: string;
  hexColor?: string;
}

export interface CreateProjectTool {
  name: string;
  description?: string;
  hexColor?: string;
}
