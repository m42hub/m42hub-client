import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();

    // Se já estiver logado, redireciona para home ou URL de redirecionamento
    if (this.authService.isLoggedIn) {
      const redirectUrl = this.authService.getRedirectUrl() || '/';
      this.authService.clearRedirectUrl();
      this.router.navigate([redirectUrl]);
    }
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.loading = false;
          // Sucesso - navega para a URL de redirecionamento ou página inicial
          const redirectUrl = this.authService.getRedirectUrl() || '/';
          this.authService.clearRedirectUrl();
          this.router.navigate([redirectUrl]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Credenciais inválidas. Verifique seu usuário e senha.';
    } else if (error.status === 401) {
      return 'Credenciais inválidas. Verifique seu usuário e senha.';
    } else if (error.status === 0) {
      return 'Erro de conexão. Verifique sua internet.';
    } else if (error.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    } else {
      return 'Erro inesperado. Tente novamente.';
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar acesso aos controles do formulário
  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  get isUsernameInvalid() {
    return this.usernameControl?.invalid && this.usernameControl?.touched;
  }

  get isPasswordInvalid() {
    return this.passwordControl?.invalid && this.passwordControl?.touched;
  }
}
