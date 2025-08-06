import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Project } from '../../../interfaces/project/project.interface';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  @Input() project!: Project;

  defaultAvatar = '/default_avatar.png';

  getStatusSeverity(): string {
    const status = this.project.status?.name.toLowerCase();
    switch (status) {
      case 'ativo': return 'success';
      case 'concluído': return 'info';
      case 'pausado': return 'warning';
      default: return 'secondary';
    }
  }

  getComplexitySeverity(): string {
    const complexity = this.project.complexity?.name.toLowerCase();
    switch (complexity) {
      case 'alta': return 'danger';
      case 'média': return 'warning';
      case 'baixa': return 'success';
      default: return 'secondary';
    }
  }

  getImageUrl(): string {
    return this.project.imageUrl || this.defaultAvatar;
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  getTools(): string[] {
    return this.project.tools?.map((t) => t.name) || [];
  }

  getTopics(): string[] {
    return this.project.topics?.map((t) => t.name) || [];
  }

  formatDate(date?: string | Date): string {
    if (!date) return 'Não definida';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  }
}
