import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  @Input() project!: Project;

  defaultAvatar = '/default_avatar.png';

  getStatusSeverity(status?: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'on-hold': return 'warning';
      default: return 'secondary';
    }
  }

  getTagSeverity(tag: any): string {
    switch (tag.type) {
      case 'dificuldade':
        return tag.name.toLowerCase() === 'difícil' ? 'danger' :
               tag.name.toLowerCase() === 'médio' ? 'warning' : 'success';
      case 'complexidade':
        return tag.name.toLowerCase() === 'alta' ? 'danger' :
               tag.name.toLowerCase() === 'média' ? 'warning' : 'success';
      case 'tempoEstimado':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getImageUrl(imageUrl: string): string {
    return imageUrl || this.defaultAvatar;
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  getTagTooltip(tag: any): string {
    const typeLabels: { [key: string]: string } = {
      'assunto': 'Tecnologia/Assunto',
      'dificuldade': 'Dificuldade',
      'tempoEstimado': 'Tempo Estimado',
      'complexidade': 'Complexidade'
    };

    return `${typeLabels[tag.type] || 'Tag'}: ${tag.name}`;
  }

  onCardClick(): void {
    // TODO: Implementar navegação para detalhes do projeto
    console.log('Card clicado:', this.project.name);
  }
}
