import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // Dados mockados para demonstração
  private projects: Project[] = [
    {
      id: '1',
      name: 'M42Hub - Plataforma de Colaboração',
      summary: 'Uma plataforma inovadora para colaboração em projetos de programação',
      description: `# M42Hub - Plataforma de Colaboração

## Sobre o Projeto

O M42Hub é uma plataforma revolucionária que conecta desenvolvedores, designers e profissionais de tecnologia para colaborar em projetos inovadores. Nossa missão é democratizar o acesso a oportunidades de desenvolvimento e criar uma comunidade vibrante de makers.

## Funcionalidades Principais

### 🚀 Gestão de Projetos
- Criação e gerenciamento de projetos colaborativos
- Sistema de tags para categorização inteligente
- Timeline e milestones para acompanhamento de progresso

### 👥 Gestão de Equipes
- Formação de equipes multidisciplinares
- Sistema de roles e responsabilidades
- Comunicação integrada entre membros

### 📊 Analytics e Insights
- Métricas de performance do projeto
- Relatórios de produtividade da equipe
- Dashboards personalizados

## Tecnologias Utilizadas

- **Frontend**: Angular 17, PrimeNG, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT, OAuth2
- **Deploy**: Docker, AWS

## Arquitetura

O projeto segue uma arquitetura modular e escalável:

\`\`\`typescript
// Exemplo de estrutura de módulos
src/
├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── interfaces/
├── shared/
└── assets/
\`\`\`

## Roadmap

### Fase 1 - MVP ✅
- [x] Sistema de autenticação
- [x] CRUD de projetos
- [x] Gestão básica de equipes

### Fase 2 - Colaboração 🚧
- [ ] Sistema de chat em tempo real
- [ ] Compartilhamento de arquivos
- [ ] Notificações push

### Fase 3 - Analytics 📈
- [ ] Dashboards avançados
- [ ] Relatórios customizáveis
- [ ] Integração com ferramentas externas

## Como Contribuir

1. **Fork** o repositório
2. Crie uma **branch** para sua feature
3. Faça **commit** das suas mudanças
4. Abra um **Pull Request**

## Equipe

Nossa equipe é composta por profissionais apaixonados por tecnologia e inovação. Cada membro traz experiências únicas e contribui para o sucesso do projeto.

## Contato

Para mais informações sobre o projeto, entre em contato conosco através dos canais oficiais da M42Hub.`,
      team: [
        {
          id: '1',
          name: 'João Silva',
          photo: '/default_avatar.png',
          role: 'Tech Lead',
          isManager: true
        },
        {
          id: '2',
          name: 'Maria Santos',
          photo: '/default_avatar.png',
          role: 'Frontend Developer'
        },
        {
          id: '3',
          name: 'Pedro Costa',
          photo: '/default_avatar.png',
          role: 'Backend Developer'
        },
        {
          id: '4',
          name: 'Ana Oliveira',
          photo: '/default_avatar.png',
          role: 'UX/UI Designer'
        }
      ],
      tags: [
        { id: '1', name: 'Angular', type: 'tecnologias/ferramentas', color: '#dd0031' },
        { id: '2', name: 'TypeScript', type: 'tecnologias/ferramentas', color: '#3178c6' },
        { id: '3', name: 'Node.js', type: 'tecnologias/ferramentas', color: '#339933' },
        { id: '4', name: 'Tecnologia', type: 'assuntos', color: '#009688' },
        { id: '5', name: 'Inovação', type: 'assuntos', color: '#ff4081' },
        { id: '6', name: '3-6 meses', type: 'tempoEstimado', color: '#42a5f5' }
      ],
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      startDate: new Date('2024-02-01'),
      expectedDate: new Date('2024-08-01'),
      unfilledRoles: ['DevOps Engineer', 'QA Tester']
    }
  ];

  constructor() { }

  getProjectById(id: string): Observable<Project | undefined> {
    const project = this.projects.find(p => p.id === id);
    return of(project);
  }

  getAllProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  createProject(project: Project): Observable<Project> {
    const newProject = { ...project, id: this.generateId() };
    this.projects.push(newProject);
    return of(newProject);
  }

  updateProject(project: Project): Observable<Project> {
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this.projects[index] = { ...project, updatedAt: new Date() };
      return of(this.projects[index]);
    } else {
      return new Observable(observer => {
        observer.error(new Error('Projeto não encontrado'));
      });
    }
  }

  private generateId(): string {
    // Usar timestamp + random para evitar colisões
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}
