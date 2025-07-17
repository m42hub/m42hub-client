export interface TeamMember {
  id: string;
  name: string;
  photo: string;
  role: string;
  isManager?: boolean;
}

export interface ProjectTag {
  id: string;
  name: string;
  type: 'assunto' | 'dificuldade' | 'tempoEstimado' | 'complexidade';
  color?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  team: TeamMember[];
  tags: ProjectTag[];
  image?: string;
  status?: 'active' | 'completed' | 'on-hold';
  createdAt: Date;
  updatedAt: Date;
}
