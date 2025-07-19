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
  type: 'tecnologias/ferramentas' | 'assuntos' | 'tempoEstimado' | 'complexidade';
  color?: string;
}

export interface Project {
  id: string;
  name: string;
  summary?: string; // Resumo do projeto
  description: string;
  team: TeamMember[];
  tags: ProjectTag[];
  image?: string;
  status?: 'active' | 'completed' | 'on-hold';
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date; // Data de início
  expectedDate?: Date; // Data prevista
  unfilledRoles?: string[]; // Roles/vagas necessárias
}
