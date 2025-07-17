import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProjectsComponent as ProjectCardComponent } from '../../components/cards/projects/projects.component';
import { Project, TeamMember, ProjectTag } from '../../interfaces/project.interface';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
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
        { id: '1', name: 'React', type: 'assunto' },
        { id: '2', name: 'Node.js', type: 'assunto' },
        { id: '3', name: 'Médio', type: 'dificuldade' },
        { id: '4', name: '3 meses', type: 'tempoEstimado' },
        { id: '5', name: 'Alta', type: 'complexidade' }
      ],
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20')
    },
    {
      id: '2',
      name: 'App de Delivery',
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
        { id: '6', name: 'React Native', type: 'assunto' },
        { id: '7', name: 'Firebase', type: 'assunto' },
        { id: '8', name: 'Difícil', type: 'dificuldade' },
        { id: '9', name: '6 meses', type: 'tempoEstimado' },
        { id: '10', name: 'Muito Alta', type: 'complexidade' }
      ],
      status: 'active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-25')
    },
    {
      id: '3',
      name: 'Sistema de Gestão Escolar',
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
        { id: '11', name: 'Angular', type: 'assunto' },
        { id: '12', name: 'Java', type: 'assunto' },
        { id: '13', name: 'Fácil', type: 'dificuldade' },
        { id: '14', name: '2 meses', type: 'tempoEstimado' },
        { id: '15', name: 'Média', type: 'complexidade' }
      ],
      status: 'completed',
      createdAt: new Date('2023-11-10'),
      updatedAt: new Date('2024-01-30')
    }
  ];

  pageSize = 2;
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
}
