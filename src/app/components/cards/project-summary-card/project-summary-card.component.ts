import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SocialMediaCardComponent } from '../social-media-card/social-media-card.component';
import type { ProjectListItem } from '../../../interfaces/project/project.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-project-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    SocialMediaCardComponent,
  ],
  templateUrl: './project-summary-card.component.html',
  styleUrl: './project-summary-card.component.css',
})
export class ProjectSummaryCardComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  @Input() project!: ProjectListItem;
  showImage = true;

  getTools(): string[] {
    return this.project.toolNames || [];
  }

  getTopics(): string[] {
    return this.project.topicNames || [];
  }

  getComplexity(): string {
    return this.project.complexityName || '';
  }

  getStatus(): string {
    return this.project.statusName || '';
  }

  getUnfilledRoles(): string[] {
    return this.project.unfilledRoleNames || [];
  }

  getGeneralTags(): { label: string; tooltip: string }[] {
    const tags: { label: string; tooltip: string }[] = [];

    const complexity = this.getComplexity();
    if (complexity) {
      tags.push({ label: complexity, tooltip: 'Complexidade' });
    }

    const status = this.getStatus();
    if (status) {
      tags.push({ label: status, tooltip: 'Status' });
    }

    return tags;
  }

  getGeneralTagTooltip(tag: { label: string; tooltip: string }): string {
    return tag.tooltip;
  }

  formatDate(date?: string | Date): string {
    if (!date) {
      return 'Não definida';
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  }

  onImageError() {
    this.showImage = false;
  }

  getImageUrl(): string {
    return this.project.imageUrl || '/assets/project-banner-mock.jpg';
  }

  viewProjectDetails(id: number | string): void {
    void this.router.navigate([`/projects/${id}`]);
  }

  editProject(id: number | string): void {
    if (this.authService.isLoggedIn) {
      void this.router.navigate([`/projects/${id}/edit`]);
    } else {
      this.authService.setRedirectUrl(`/projects/${id}`);
      void this.router.navigate(['/login']);
    }
  }

  get tools(): string[] {
    return this.getTools();
  }
  get topics(): string[] {
    return this.getTopics();
  }
  get unfilledRoles(): string[] {
    return this.getUnfilledRoles();
  }
  get generalTags(): { label: string; tooltip: string }[] {
    return this.getGeneralTags();
  }
  get isUserManager(): boolean {
    const currentUser = this.authService.currentUser;
    if (currentUser && this.project?.manager && currentUser.username === this.project?.manager) {
      return true;
    }
    return false;
  }
  get creationDateFormatado(): string {
    return this.formatDate(this.project?.creationDate);
  }
  get startDateFormatado(): string {
    return this.formatDate(this.project?.startDate);
  }
  get endDateFormatado(): string {
    return this.formatDate(this.project?.endDate);
  }
  get onEditProject(): () => void {
    return () => this.editProject(this.project.id);
  }
  get onViewDetails(): () => void {
    return () => this.viewProjectDetails(this.project.id);
  }
  get imageUrl(): string {
    return this.getImageUrl();
  }
}
