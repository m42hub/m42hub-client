import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import type { ProjectListItem } from '../../../interfaces/project/project.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-user-project-summary-card',
  imports: [CommonModule, CardModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './user-project-summary-card.component.html',
  styleUrl: './user-project-summary-card.component.css',
})
export class UserProjectSummaryCardComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  @Input() project!: ProjectListItem;
  @Input() roleName?: string;
  @Input() requestDate?: string;
  showImage = true;

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

  getComplexity(): string {
    return this.project.complexityName || '';
  }

  getStatus(): string {
    return this.project.statusName || '';
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

  get isUserManager(): boolean {
    const currentUser = this.authService.currentUser;
    if (currentUser && this.project?.manager && currentUser.username === this.project?.manager) {
      return true;
    }
    return false;
  }
  get generalTags(): { label: string; tooltip: string }[] {
    return this.getGeneralTags();
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
  get requestDateFormatado(): string {
    return this.formatDate(this.requestDate);
  }
}
