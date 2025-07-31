import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProjectsComponent as ProjectCardComponent } from '../../components/cards/projects/projects.component';
import { ProjectSummaryCardComponent } from '../../components/cards/project-summary-card/project-summary-card.component';
import { Project, TeamMember, ProjectTag } from '../../interfaces/projectMock.interface';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProjectSummaryCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  constructor(private router: Router) {}

  projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      summary: 'Plataforma de e-commerce com pagamentos, estoque e painel administrativo.',
      description: 'Plataforma completa de e-commerce com sistema de pagamentos, gestão de estoque e painel administrativo.',
      team: [
        {
          id: '1',
          name: 'João Silva',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Backend',
          isManager: true
        },
        {
          id: '2',
          name: 'Maria Santos',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          role: 'Designer UX/UI'
        },
        {
          id: '3',
          name: 'Pedro Costa',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Frontend'
        }
      ],
      tags: [
        { id: '1', name: 'React', type: 'tecnologias/ferramentas' },
        { id: '2', name: 'Node.js', type: 'tecnologias/ferramentas' },
        { id: '3', name: 'E-commerce', type: 'assuntos' },
        { id: '4', name: '3 meses', type: 'tempoEstimado' },
        { id: '5', name: 'Alta', type: 'complexidade' }
      ],
      unfilledRoles: ['DevOps', 'QA'],
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20')
    },
    {
      id: '2',
      name: 'App de Delivery',
      summary: 'Aplicativo de delivery moderno, focado em experiência do usuário e integração com múltiplos restaurantes.',
      description: "Cras efficitur erat nec facilisis gravida. Fusce a auctor elit. Maecenas scelerisque lorem non ante congue rhoncus. Mauris massa orci, faucibus a tellus eget, pharetra posuere quam. Aenean eget sollicitudin ipsum. Ut at sapien tempus, iaculis arcu sit amet, congue ligula. Sed auctor mi eget condimentum placerat. Aliquam condimentum lorem id justo ornare dapibus et eget sem. In lorem magna, tempus vitae elementum vitae, molestie sed mauris. Vivamus volutpat nisl vel tortor pellentesque tristique. Aliquam erat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque porta ante non dictum eleife Aliquam pulvinar congue nisl sed luctus. Nam tincidunt venenatis placerat. Nullam cursus mauris arcu, ut cursus velit commodo sit amet. Pellentesque molestie dui felis, venenatis pharetra velit aliquet ut. Suspendisse hendrerit, diam sed euismod scelerisque, dolor tortor iaculis orci, quis bibendum metus turpis a velit. Duis sagittis magna ligula, ac lacinia neque hendrerit molestie. Sed enim mauris, commodo sed lobortis sit amet, fermentum quis odio. Maecenas sed laoreet urna. Sed ullamcorper ex ac purus tristique, vitae faucibus neque fermentum. Nunc vitae ipsum mi. Ut vehicula placerat vulputate.",
      team: [
        {
          id: '4',
          name: 'Ana Oliveira',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Mobile',
          isManager: true
        },
        {
          id: '5',
          name: 'Carlos Lima',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          role: 'Arquiteto de Software'
        },
        {
          id: '6',
          name: 'Fernanda Rocha',
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          role: 'Designer de Produto'
        }
      ],
      tags: [
        { id: '6', name: 'React Native', type: 'tecnologias/ferramentas' },
        { id: '7', name: 'Firebase', type: 'tecnologias/ferramentas' },
        { id: '8', name: 'Mobile', type: 'assuntos' },
        { id: '9', name: '6 meses', type: 'tempoEstimado' },
        { id: '10', name: 'Muito Alta', type: 'complexidade' }
      ],
      unfilledRoles: ['Product Owner', 'QA'],
      status: 'active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-25')
    },
    {
      id: '3',
      name: 'Sistema de Gestão Escolar',
      summary: 'Sistema web para gestão escolar: matrículas, notas e comunicação com pais.',
      description: 'Sistema web para gestão completa de escolas, incluindo matrículas, notas e comunicação com pais.',
      team: [
        {
          id: '7',
          name: 'Roberto Alves',
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Full Stack',
          isManager: true
        },
        {
          id: '8',
          name: 'Lucia Ferreira',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
          role: 'Analista de Sistemas'
        }
      ],
      tags: [
        { id: '11', name: 'Angular', type: 'tecnologias/ferramentas' },
        { id: '12', name: 'Java', type: 'tecnologias/ferramentas' },
        { id: '13', name: 'Educação', type: 'assuntos' },
        { id: '14', name: '2 meses', type: 'tempoEstimado' },
        { id: '15', name: 'Média', type: 'complexidade' }
      ],
      unfilledRoles: ['Coordenador Pedagógico'],
      status: 'completed',
      createdAt: new Date('2023-11-10'),
      updatedAt: new Date('2024-01-30')
    },
    {
      id: '4',
      name: 'Rede Social para Gamers',
      summary: 'Plataforma social para gamers com chat, grupos e compartilhamento de conquistas.',
      description: 'Rede social especializada para gamers com sistema de chat em tempo real, grupos por jogo, compartilhamento de conquistas e integração com APIs de jogos populares.',
      team: [
        {
          id: '9',
          name: 'Lucas Mendes',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Full Stack',
          isManager: true
        },
        {
          id: '10',
          name: 'Camila Santos',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Backend'
        }
      ],
      tags: [
        { id: '16', name: 'Vue.js', type: 'tecnologias/ferramentas' },
        { id: '17', name: 'Socket.io', type: 'tecnologias/ferramentas' },
        { id: '18', name: 'MongoDB', type: 'tecnologias/ferramentas' },
        { id: '19', name: 'Redes Sociais', type: 'assuntos' },
        { id: '20', name: '8 meses', type: 'tempoEstimado' },
        { id: '21', name: 'Muito Alta', type: 'complexidade' }
      ],
      unfilledRoles: ['DevOps', 'UI/UX Designer', 'QA'],
      status: 'active',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-28')
    },
    {
      id: '5',
      name: 'App de Finanças Pessoais',
      summary: 'Aplicativo para controle financeiro pessoal com gráficos e metas de economia.',
      description: 'Aplicativo mobile para controle completo de finanças pessoais, incluindo categorização de gastos, gráficos interativos, metas de economia e alertas de orçamento.',
      team: [
        {
          id: '11',
          name: 'Rafael Costa',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Mobile',
          isManager: true
        },
        {
          id: '12',
          name: 'Juliana Lima',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          role: 'Designer UX/UI'
        }
      ],
      tags: [
        { id: '22', name: 'Flutter', type: 'tecnologias/ferramentas' },
        { id: '23', name: 'Firebase', type: 'tecnologias/ferramentas' },
        { id: '24', name: 'Finanças', type: 'assuntos' },
        { id: '25', name: '4 meses', type: 'tempoEstimado' },
        { id: '26', name: 'Alta', type: 'complexidade' }
      ],
      unfilledRoles: ['Product Manager', 'QA'],
      status: 'active',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-03-22')
    },
    {
      id: '6',
      name: 'Sistema de CRM',
      summary: 'Sistema de gestão de relacionamento com clientes para pequenas empresas.',
      description: 'Sistema completo de CRM para pequenas e médias empresas, com gestão de leads, pipeline de vendas, histórico de interações e relatórios analíticos.',
      team: [
        {
          id: '13',
          name: 'Diego Silva',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Backend',
          isManager: true
        },
        {
          id: '14',
          name: 'Amanda Rocha',
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Frontend'
        },
        {
          id: '15',
          name: 'Thiago Oliveira',
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
          role: 'Analista de Dados'
        }
      ],
      tags: [
        { id: '27', name: 'React', type: 'tecnologias/ferramentas' },
        { id: '28', name: 'Python', type: 'tecnologias/ferramentas' },
        { id: '29', name: 'PostgreSQL', type: 'tecnologias/ferramentas' },
        { id: '30', name: 'Produtividade', type: 'assuntos' },
        { id: '31', name: '5 meses', type: 'tempoEstimado' },
        { id: '32', name: 'Alta', type: 'complexidade' }
      ],
      unfilledRoles: ['Business Analyst', 'DevOps'],
      status: 'on-hold',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-03-15')
    },
    {
      id: '7',
      name: 'Plataforma de Cursos Online',
      summary: 'Plataforma para criação e venda de cursos online com sistema de pagamentos.',
      description: 'Plataforma completa para criação, hospedagem e venda de cursos online, incluindo sistema de pagamentos, certificados, fórum de discussão e analytics para instrutores.',
      team: [
        {
          id: '16',
          name: 'Carolina Mendes',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
          role: 'Product Manager',
          isManager: true
        },
        {
          id: '17',
          name: 'Gabriel Alves',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Full Stack'
        },
        {
          id: '18',
          name: 'Isabela Costa',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          role: 'Designer UX/UI'
        }
      ],
      tags: [
        { id: '33', name: 'Next.js', type: 'tecnologias/ferramentas' },
        { id: '34', name: 'Stripe', type: 'tecnologias/ferramentas' },
        { id: '35', name: 'AWS', type: 'tecnologias/ferramentas' },
        { id: '36', name: 'Educação', type: 'assuntos' },
        { id: '37', name: '10 meses', type: 'tempoEstimado' },
        { id: '38', name: 'Muito Alta', type: 'complexidade' }
      ],
      unfilledRoles: ['DevOps Engineer', 'QA Lead', 'Content Manager'],
      status: 'active',
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2024-03-30')
    },
    {
      id: '8',
      name: 'App de Gestão de Tarefas',
      summary: 'Aplicativo para gestão de tarefas pessoais e em equipe com Kanban board.',
      description: 'Aplicativo para gestão eficiente de tarefas pessoais e em equipe, com Kanban board, lembretes, priorização e integração com calendário.',
      team: [
        {
          id: '19',
          name: 'Marcos Ferreira',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Frontend',
          isManager: true
        },
        {
          id: '20',
          name: 'Patrícia Lima',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          role: 'Desenvolvedor Backend'
        }
      ],
      tags: [
        { id: '39', name: 'Svelte', type: 'tecnologias/ferramentas' },
        { id: '40', name: 'Supabase', type: 'tecnologias/ferramentas' },
        { id: '41', name: 'Produtividade', type: 'assuntos' },
        { id: '42', name: '2 meses', type: 'tempoEstimado' },
        { id: '43', name: 'Média', type: 'complexidade' }
      ],
      unfilledRoles: ['UX Designer'],
      status: 'completed',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-02-28')
    }
  ];

  pageSize = 3;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.pageSize);
  }

  get paginatedProjects(): Project[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.projects.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  createNewProject(): void {
    this.router.navigate(['/projects/new']);
  }
}
