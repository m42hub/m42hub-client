import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Project } from '../../../interfaces/projectMock.interface';
import { ProjectTag } from '../../../interfaces/projectMock.interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-project-summary-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './project-summary-card.component.html',
  styleUrl: './project-summary-card.component.css'
})
export class ProjectSummaryCardComponent {

  constructor(private router: Router) {}

  @Input() project!: Project;
  showImage: boolean = true;

  getTechTags(): ProjectTag[] {
    return this.project.tags?.filter((tag: ProjectTag) => tag.type === 'tecnologias/ferramentas') || [];
  }

  getAssuntosTags(): ProjectTag[] {
    return this.project.tags?.filter((tag: ProjectTag) => tag.type === 'assuntos') || [];
  }

  getGeneralTags(): ProjectTag[] {
    return this.project.tags as ProjectTag[] || [];
  }

  getUnfilledRoles() {
    return this.project.unfilledRoles || [];
  }

  formatDate(date?: Date): string {
    if (!date) return 'Não definida';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getTagTooltip(tag: ProjectTag): string {
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

  onImageError() {
    this.showImage = false;
  }

  viewProjectDetails(id: string): void {
    this.router.navigate([`/projects/${id}`]);
  }
}
