import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectRoleService } from '../../services/project/role.service';
import type { ProjectRole } from '../../interfaces/project/role.interface';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import type { UserInfo, UserInfoRequest } from '../../interfaces/user/user.interface';
import { UserProfileHeaderComponent } from '../../components/headers/user-profile-header/user-profile-header.component';
import { TextareaModule } from 'primeng/textarea';
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
  private fb = inject(FormBuilder);
  private projectRoleService = inject(ProjectRoleService);
  allRoles: ProjectRole[] = [];

  userInfo: UserInfo | null = null;
  loading = true;
  error: string | null = null;
  isOwnProfile = false;
  editMode = false;
  editForm!: FormGroup;
  saveLoading = false;
  saveError: string | null = null;

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    const currentUser = this.authService.currentUser;
    this.projectRoleService.getAll().subscribe({
      next: (roles) => {
        this.allRoles = roles;
      },
      error: () => {
        this.allRoles = [];
      },
    });
    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.userInfo = user;
          this.loading = false;
          this.isOwnProfile = !!currentUser && currentUser.username === user.username;
          if (this.isOwnProfile) {
            this.initEditForm();
          }
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

  initEditForm() {
    if (!this.userInfo) return;
    this.editForm = this.fb.group({
      firstName: [this.userInfo.firstName, [Validators.required]],
      lastName: [this.userInfo.lastName, [Validators.required]],
      biography: [this.userInfo.biography],
      discord: [this.userInfo.discord],
      linkedin: [this.userInfo.linkedin],
      github: [this.userInfo.github],
      personalWebsite: [this.userInfo.personalWebsite],
      interestRoles: [this.userInfo.interestRoles.map((r) => r.id)],
    });
  }

  enableEdit() {
    this.editMode = true;
    this.saveError = null;
    if (this.userInfo) this.initEditForm();
  }

  cancelEdit() {
    this.editMode = false;
    this.saveError = null;
  }

  saveEdit() {
    if (!this.userInfo || !this.editForm.valid) return;
    this.saveLoading = true;
    this.saveError = null;
    const formValue = this.editForm.value;
    const req: UserInfoRequest = {
      ...formValue,
      interestRoles: formValue.interestRoles,
    };
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
}
