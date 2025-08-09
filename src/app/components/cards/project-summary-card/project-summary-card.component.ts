import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Project } from '../../../interfaces/project/project.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
  selector: 'app-project-summary-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './project-summary-card.component.html',
  styleUrl: './project-summary-card.component.css',
})
export class ProjectSummaryCardComponent {
  constructor(private router: Router, private authService: AuthService) {}

  @Input() project!: Project;
  showImage: boolean = true;

  getTools(): string[] {
    return this.project.tools?.map((t) => t.name) || [];
  }

  getTopics(): string[] {
    return this.project.topics?.map((t) => t.name) || [];
  }

  getComplexity(): string {
    return this.project.complexity?.name || '';
  }

  getStatus(): string {
    return this.project.status?.name || '';
  }

  getUnfilledRoles(): string[] {
    return this.project.unfilledRoles?.map((r) => r.name) || [];
  }

  getGeneralTags(): { label: string; tooltip: string }[] {
    const tags: { label: string; tooltip: string }[] = [];

    const complexity = this.getComplexity();
    if (complexity) tags.push({ label: complexity, tooltip: 'Complexidade' });

    const status = this.getStatus();
    if (status) tags.push({ label: status, tooltip: 'Status' });

    return tags;
  }

  getGeneralTagTooltip(tag: { label: string; tooltip: string }): string {
    return tag.tooltip;
  }

  formatDate(date?: string | Date): string {
    if (!date) return 'Não definida';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  }

  onDetailsClick() {
    // TODO: Implementar navegação ou emissão de evento para detalhes
    console.log('Ver detalhes do projeto:', this.project.id);
  }

  onImageError() {
    this.showImage = false;
  }

  viewProjectDetails(id: number | string): void {
    this.router.navigate([`/projects/${id}`]);
  }

  editProject(id: number | string): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate([`/projects/${id}/edit`]);
    } else {
      this.authService.setRedirectUrl(`/projects/${id}`);
      this.router.navigate(['/login']);
    }
  }

  isUserManager(): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.project.members) {
      return false;
    }

    const userMember = this.project.members.find(member =>
      member.user.username === currentUser.username && member.isManager
    );

    return !!userMember;
  }
}
