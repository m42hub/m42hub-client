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
import type { UserInfo, UserInfoRequest } from '../../interfaces/user/user.interface';
import { UserProfileHeaderComponent } from '../../components/headers/user-profile-header/user-profile-header.component';
import { UserProfileFormComponent } from '../../components/forms/user-profile-form/user-profile-form.component';
import { TextareaModule } from 'primeng/textarea';
import { UserChangePasswordFormComponent } from '../../components/forms/user-change-password-form/user-change-password-form.component';
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
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  userInfo: UserInfo | null = null;
  loading = true;
  error: string | null = null;
  editMode = false;
  saveLoading = false;
  saveError: string | null = null;
  currentUser = this.authService.currentUser;
  showChangePasswordForm = false;

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.userInfo = user;
          this.loading = false;
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
}
