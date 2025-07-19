import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-summary-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './project-summary-card.component.html',
  styleUrl: './project-summary-card.component.css'
})
export class ProjectSummaryCardComponent {
  @Input() project!: Project;

  getTechTags() {
    return this.project.tags?.filter(tag => tag.type === 'tecnologias/ferramentas') || [];
  }

  getAssuntosTags() {
    return this.project.tags?.filter(tag => tag.type === 'assuntos') || [];
  }

  getGeneralTags() {
    return this.project.tags || [];
  }

  getUnfilledRoles() {
    return this.project.unfilledRoles || [];
  }

  formatDate(date?: Date): string {
    if (!date) return 'Não definida';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getTagTooltip(tag: any): string {
    const typeLabels: { [key: string]: string } = {
      'tecnologias/ferramentas': 'Tecnologia/Ferramenta',
      'assuntos': 'Assunto/Tema',
      'tempoEstimado': 'Tempo Estimado',
      'complexidade': 'Complexidade'
    };

    return typeLabels[tag.type] || 'Tag';
  }

  onDetailsClick() {
    // TODO: Implementar navegação ou emissão de evento para detalhes
    console.log('Ver detalhes do projeto:', this.project.id);
  }
}
