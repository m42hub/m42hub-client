import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProjectMemberService } from '../../services/project/member.service';
import { UserProjectsCarouselComponent } from '../../components/carousels/user-projects-carousel/user-projects-carousel.component';
import type { ProjectMemberProject } from '../../interfaces/project/member.interface';
import type { UserInfo, UserInfoRequest } from '../../interfaces/user/user.interface';
import { UserProfileHeaderComponent } from '../../components/headers/user-profile-header/user-profile-header.component';
import { UserProfileFormComponent } from '../../components/forms/user-profile-form/user-profile-form.component';
import { TextareaModule } from 'primeng/textarea';
import { UserChangePasswordFormComponent } from '../../components/forms/user-change-password-form/user-change-password-form.component';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    CardModule,
    TagModule,
    DividerModule,
    ButtonModule,
    ProgressSpinnerModule,
    UserProfileHeaderComponent,
    UserProfileFormComponent,
    UserChangePasswordFormComponent,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    TextareaModule,
    DialogModule,
    UserProjectsCarouselComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private memberService = inject(ProjectMemberService);

  userInfo: UserInfo | null = null;
  loading = true;
  error: string | null = null;
  editMode = false;
  saveLoading = false;
  saveError: string | null = null;
  currentUser = this.authService.currentUser;
  showChangePasswordForm = false;
  showDeleteAccountModal = false;
  deleteLoading = false;
  deleteError: string | null = null;

  ongoingProjects: ProjectMemberProject[] = [];
  finishedProjects: ProjectMemberProject[] = [];
  numVisible = 3;
  isDarkMode = false;

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.userInfo = user;
          // Buscar projetos do usuário
          this.memberService.getByUsername(username).subscribe({
            next: (projects) => {
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
              this.error = 'Erro ao carregar projetos do usuário.';
              this.loading = false;
            },
          });
        },
        error: () => {
          this.error = 'Usuário não encontrado ou erro ao carregar.';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Nome de usuário não fornecido.';
      this.loading = false;
    }
    // Detectar tema
    if (typeof window !== 'undefined') {
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
      this.handleResponsiveNumVisible();
      window.addEventListener('resize', this.handleResponsiveNumVisible.bind(this));
    }
  }

  private handleResponsiveNumVisible(): void {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width < 1110) this.numVisible = 1;
    else if (width < 1590) this.numVisible = 2;
    else this.numVisible = 3;
  }

  enableEdit() {
    this.editMode = true;
    this.saveError = null;
  }

  cancelEdit() {
    this.editMode = false;
    this.saveError = null;
  }

  saveEdit(req: UserInfoRequest) {
    if (!this.userInfo) return;
    this.saveLoading = true;
    this.saveError = null;
    this.userService.editInfo(this.userInfo.username, req).subscribe({
      next: (updated) => {
        this.userInfo = { ...this.userInfo, ...updated };
        this.editMode = false;
        this.saveLoading = false;
      },
      error: (_err) => {
        this.saveError = 'Erro ao salvar alterações.';
        this.saveLoading = false;
      },
    });
  }

  get isOwnProfile(): boolean {
    return !!(
      this.currentUser &&
      this.userInfo &&
      this.currentUser.username === this.userInfo.username
    );
  }

  openChangePasswordForm() {
    this.showChangePasswordForm = true;
  }

  closeChangePasswordForm() {
    this.showChangePasswordForm = false;
  }

  openDeleteAccountModal() {
    this.showDeleteAccountModal = true;
    this.deleteError = null;
  }

  closeDeleteAccountModal() {
    this.showDeleteAccountModal = false;
    this.deleteError = null;
  }

  deleteAccount() {
    if (!this.userInfo) return;
    this.deleteLoading = true;
    this.deleteError = null;
    this.userService.deactivateUser(this.userInfo.username).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.showDeleteAccountModal = false;
        window.location.href = '/login';
      },
      error: () => {
        this.deleteError = 'Erro ao excluir conta. Tente novamente.';
        this.deleteLoading = false;
      },
    });
  }
}
