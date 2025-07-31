export interface ProjectTopic {
  id: number;
  name: string;
  description?: string;
  hexColor?: string;
}

export interface CreateProjectTopic {
  name: string;
  description?: string;
  hexColor?: string;
}
