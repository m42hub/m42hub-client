// ...existing code...
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProjectMemberService } from '../../services/project/member.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserProjectsCarouselComponent } from '../../components/carousels/user-projects-carousel/user-projects-carousel.component';
import { CarouselModule } from 'primeng/carousel';
import type { ProjectMemberProject } from '../../interfaces/project/member.interface';

@Component({
  selector: 'app-user-projects',
  standalone: true,
  imports: [CommonModule, CarouselModule, UserProjectsCarouselComponent],
  templateUrl: './user-projects.component.html',
  styleUrl: './user-projects.component.css',
})
export class UserProjectsComponent implements OnInit {
  requestedProjects: ProjectMemberProject[] = [];
  ongoingProjects: ProjectMemberProject[] = [];
  finishedProjects: ProjectMemberProject[] = [];
  loading = true;
  error: string | null = null;
  numVisible = 3;
  isDarkMode = false;

  constructor(
    private memberService: ProjectMemberService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const html = document.documentElement;
      if (savedTheme) {
        if (savedTheme === 'dark') {
          html.classList.add('dark');
          this.isDarkMode = true;
        } else {
          html.classList.remove('dark');
          this.isDarkMode = false;
        }
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          html.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          this.isDarkMode = true;
        } else {
          this.isDarkMode = false;
        }
      }

      // Responsividade
      this.numVisible = this.getNumVisibleForWidth(window.innerWidth);
      window.addEventListener('resize', () => {
        this.numVisible = this.getNumVisibleForWidth(window.innerWidth);
      });
    }

    if (isPlatformBrowser(this.platformId) && this.authService.currentUser) {
      const username = this.authService.currentUser.username;
      this.memberService.getByUsername(username).subscribe({
        next: (projects) => {
          this.requestedProjects = projects.filter(
            (member) => member.memberStatus && member.memberStatus.id === 1,
          );
          const userProjects = projects.filter(
            (member) => member.memberStatus && member.memberStatus.id === 2,
          );
          this.ongoingProjects = userProjects.filter((member) => {
            const status = member.projectListItem?.statusName?.toLowerCase();
            return status === 'em andamento' || status === 'fase de testes';
          });
          this.finishedProjects = userProjects.filter((member) => {
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

  private getNumVisibleForWidth(width: number): number {
    if (width < 1110) return 1;
    if (width < 1590) return 2;
    return 3;
  }
}
