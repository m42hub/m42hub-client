import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProjectMemberService } from '../../services/project/member.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProjectSummaryCardComponent } from '../../components/cards/project-summary-card/project-summary-card.component';
import { CarouselModule } from 'primeng/carousel';
import type { ProjectMemberProject } from '../../interfaces/project/member.interface';

@Component({
  selector: 'app-user-projects',
  standalone: true,
  imports: [CommonModule, ProjectSummaryCardComponent, CarouselModule],
  templateUrl: './user-projects.component.html',
  styleUrl: './user-projects.component.css',
})
export class UserProjectsComponent implements OnInit {
  userProjects: ProjectMemberProject[] = [];
  ongoingProjects: ProjectMemberProject[] = [];
  finishedProjects: ProjectMemberProject[] = [];
  loading = true;
  error: string | null = null;

  numVisible = 3;
  private readonly breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xl2: 1536,
  };

  constructor(
    private memberService: ProjectMemberService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.handleResponsiveNumVisible();
    if (this.isBrowser() && this.authService.currentUser) {
      const username = this.authService.currentUser.username;
      this.memberService.getByUsername(username).subscribe({
        next: (projects) => {
          // Filtra membros aprovados (status id 2)
          this.userProjects = projects.filter(
            (member) => member.memberStatus && member.memberStatus.id === 2,
          );
          // Agrupa projetos em andamento (status 2 ou 3) e concluídos (status 4)
          this.ongoingProjects = this.userProjects.filter((member) => {
            const status = member.projectListItem?.statusName?.toLowerCase();
            return status === 'em andamento' || status === 'fase de testes';
          });
          this.finishedProjects = this.userProjects.filter((member) => {
            const status = member.projectListItem?.statusName?.toLowerCase();
            return status === 'concluído' || status === 'concluido';
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar seus projetos.';
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
      this.error = 'Usuário não autenticado.';
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser()) {
      this.handleResponsiveNumVisible();
    }
  }

  private handleResponsiveNumVisible(): void {
    if (!this.isBrowser()) return;
    const width = window.innerWidth;
    const newNumVisible = this.getNumVisibleForWidth(width);
    if (newNumVisible !== this.numVisible) {
      this.numVisible = newNumVisible;
    }
  }

  private getNumVisibleForWidth(width: number): number {
    if (width < this.breakpoints.lg) return 1;
    if (width < this.breakpoints.xl2) return 2;
    return 3;
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
