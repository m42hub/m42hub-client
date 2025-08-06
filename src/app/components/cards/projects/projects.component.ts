import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Project } from '../../../interfaces/projectMock.interface';

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
      'tecnologias/ferramentas': 'Tecnologia/Ferramenta',
      'assuntos': 'Assunto/Tema',
      'tempoEstimado': 'Tempo Estimado',
      'complexidade': 'Complexidade'
    };

    return `${typeLabels[tag.type] || 'Tag'}: ${tag.name}`;
  }
}
