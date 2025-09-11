import type { AfterViewChecked, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { Project } from '../../../interfaces/project/project.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import mermaid from 'mermaid';
import { SocialMediaCardComponent } from '../social-media-card/social-media-card.component';

@Component({
  selector: 'app-project-description-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    TooltipModule,
    ButtonModule,
    SocialMediaCardComponent,
  ],
  templateUrl: './project-description-card.component.html',
  styleUrl: './project-description-card.component.css',
})
export class ProjectDescriptionCardComponent implements OnInit, AfterViewChecked {
  // Getter para verificar se o usuário é manager
  get isUserManager(): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.project?.members) {
      return false;
    }
    return this.project.members.some(
      (member) => member.user.username === currentUser.username && member.isManager,
    );
  }

  // Getter para função de editar projeto (usado como property binding)
  get onEditProject(): () => void {
    return () => this.editProject(this.project.id);
  }

  // Getters para datas formatadas
  get creationDateFormatado(): string {
    return this.formatDate(this.project?.creationDate);
  }
  get startDateFormatado(): string {
    return this.formatDate(this.project?.startDate);
  }
  get endDateFormatado(): string {
    return this.formatDate(this.project?.endDate);
  }

  // Getter para tooltip de tag (usado como property binding)
  get getTagTooltipFn(): (tag: any) => string {
    return (tag: any) => this.getTagTooltip(tag);
  }
  @Input() project!: Project;
  descriptionHtml: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    void this.renderDescription();
  }

  private async renderDescription(): Promise<void> {
    if (this.project?.description) {
      const html = await marked.parse(this.project.description);
      this.descriptionHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  private processMermaidDiagrams(): void {
    if (!this.descriptionHtml) return;

    setTimeout(() => {
      const mermaidBlocks = document.querySelectorAll('.language-mermaid');
      mermaidBlocks.forEach((block) => {
        const code = block.textContent || '';
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.textContent = code;
        block.parentNode?.replaceChild(container, block);

        try {
          void mermaid.init(undefined, container);
        } catch {
          container.textContent = 'Erro ao renderizar diagrama Mermaid';
        }
      });
    }, 0);
  }

  ngAfterViewChecked(): void {
    this.processMermaidDiagrams();
  }

  get tools() {
    return this.project.tools || [];
  }

  get topics() {
    return this.project.topics || [];
  }

  get generalTags() {
    const typeLabels: { [key: string]: string } = {
      ferramentas: 'Tecnologia/Ferramenta',
      assuntos: 'Assunto/Tema',
      tempoEstimado: 'Tempo Estimado',
      complexidade: 'Complexidade',
    };
    const allTags = [
      ...(this.project.tools || []).map((tool) => ({
        ...tool,
        type: 'ferramentas',
        tooltipLabel: typeLabels['ferramentas'],
      })),
      ...(this.project.topics || []).map((topic) => ({
        ...topic,
        type: 'assuntos',
        tooltipLabel: typeLabels['assuntos'],
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
    if (!date) {
      return 'Não definida';
    }
    const dateCorrectType = typeof date === 'string' ? new Date(date) : date;
    return dateCorrectType.toLocaleDateString('pt-BR');
  }

  editProject(id: number | string): void {
    if (this.authService.isLoggedIn) {
      void this.router.navigate([`/projects/${id}/edit`]);
    }
  }
}
