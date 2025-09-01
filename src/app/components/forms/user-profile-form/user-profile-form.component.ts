import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import type { ProjectRole } from '../../../interfaces/project/role.interface';
import type { UserInfo, UserInfoRequest } from '../../../interfaces/user/user.interface';
import { ProjectRoleService } from '../../../services/project/role.service';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrl: './user-profile-form.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
  ],
})
export class UserProfileFormComponent implements OnChanges {
  @Input() userInfo!: UserInfo;
  @Input() saveLoading = false;
  @Input() saveError: string | null = null;
  @Output() save = new EventEmitter<UserInfoRequest>();
  @Output() cancelEdit = new EventEmitter<void>();

  private projectRoleService = inject(ProjectRoleService);
  allRoles: ProjectRole[] = [];
  editForm!: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userInfo'] && this.userInfo) {
      this.initForm();
    }

    this.projectRoleService.getAll().subscribe({
      next: (roles) => {
        this.allRoles = roles;
      },
      error: () => {
        this.allRoles = [];
      },
    });
  }

  initForm() {
    this.editForm = this.fb.group({
      firstName: [this.userInfo.firstName || '', [Validators.required]],
      lastName: [this.userInfo.lastName || '', [Validators.required]],
      biography: [this.userInfo.biography || ''],
      discord: [this.userInfo.discord || ''],
      linkedin: [this.userInfo.linkedin || ''],
      github: [this.userInfo.github || ''],
      personalWebsite: [this.userInfo.personalWebsite || ''],
      interestRoles: [
        Array.isArray(this.userInfo.interestRoles)
          ? this.userInfo.interestRoles.map((r) => r.id)
          : [],
      ],
    });
  }

  onSave() {
    if (!this.editForm.valid) return;
    const formValue = this.editForm.value;
    const req: UserInfoRequest = {
      ...formValue,
      interestRoles: Array.isArray(formValue.interestRoles) ? formValue.interestRoles : [],
    };
    this.save.emit(req);
  }

  onCancel() {
    this.cancelEdit.emit();
  }
}
