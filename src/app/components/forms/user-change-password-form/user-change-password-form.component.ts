import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { UserInfo } from '../../../interfaces/user/user.interface';
import { Router } from '@angular/router';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-user-change-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, Message],
  templateUrl: './user-change-password-form.component.html',
  styleUrls: ['./user-change-password-form.component.css'],
})
export class UserChangePasswordFormComponent {
  @Input() userInfo!: UserInfo;
  @Output() closeForm = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private authService: AuthService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    if (this.form.value.newPassword !== this.form.value.confirmNewPassword) {
      this.errorMessage = 'Nova senha e confirmação não coincidem.';
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    this.userService
      .changePassword(this.userInfo.username, {
        oldPassword: this.form.value.oldPassword,
        newPassword: this.form.value.newPassword,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Senha alterada com sucesso! Redirecionando para o login...';
          this.authService.loadUser().subscribe(() => {
            setTimeout(() => {
              void this.router.navigate(['/login']);
            }, 2000);
          });
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Erro ao alterar senha.';
        },
      });
  }

  onCancel() {
    this.closeForm.emit();
  }
}
