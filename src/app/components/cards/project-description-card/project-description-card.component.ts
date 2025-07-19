import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-description-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, TooltipModule],
  templateUrl: './project-description-card.component.html',
  styleUrl: './project-description-card.component.css'
})
export class ProjectDescriptionCardComponent {
  @Input() project!: Project;
  descriptionHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.renderDescription();
  }

  private async renderDescription(): Promise<void> {
    if (this.project?.description) {
      const html = await marked.parse(this.project.description);
      this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  getTechTags() {
    return this.project.tags?.filter(tag => tag.type === 'tecnologias/ferramentas') || [];
  }

  getAssuntosTags() {
    return this.project.tags?.filter(tag => tag.type === 'assuntos') || [];
  }

  getGeneralTags() {
    return this.project.tags || [];
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

  formatDate(date?: Date): string {
    if (!date) return 'Não definida';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
