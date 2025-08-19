import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Project } from '../../../interfaces/project/project.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-project-description-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, TooltipModule, ButtonModule],
  templateUrl: './project-description-card.component.html',
  styleUrl: './project-description-card.component.css',
})
export class ProjectDescriptionCardComponent implements OnInit {
  @Input() project!: Project;
  descriptionHtml: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.renderDescription();
  }

  private async renderDescription(): Promise<void> {
    if (this.project?.description) {
      const html = await marked.parse(this.project.description);
      this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  getTools() {
    return this.project.tools || [];
  }

  getTopics() {
    return this.project.topics || [];
  }

  getGeneralTags() {
    const allTags = [
      ...(this.project.tools || []).map((tool) => ({
        ...tool,
        type: 'ferramentas',
      })),
      ...(this.project.topics || []).map((topic) => ({
        ...topic,
        type: 'assuntos',
      })),
    ];
    return allTags;
  }

  getTagTooltip(tag: any): string {
    const typeLabels: { [key: string]: string } = {
      ferramentas: 'Tecnologia/Ferramenta',
      assuntos: 'Assunto/Tema',
      tempoEstimado: 'Tempo Estimado',
      complexidade: 'Complexidade',
    };

    return typeLabels[tag.type] || 'Tag';
  }

  formatDate(date?: string | Date): string {
    if (!date) return 'Não definida';
    const dateCorrectType = typeof date === 'string' ? new Date(date) : date;
    return dateCorrectType.toLocaleDateString('pt-BR');
  }

  editProject(id: number | string): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate([`/projects/${id}/edit`]);
    }
  }

  isUserManager(): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.project.members) return false;

    return this.project.members.some(
      (member) =>
        member.user.username === currentUser.username && member.isManager
    );
  }
}
