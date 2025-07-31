export interface ProjectComplexity {
  id: number;
  name: string;
  description?: string;
  hexColor?: string;
}

export interface CreateProjectComplexity {
  name: string;
  description?: string;
  hexColor?: string;
}
