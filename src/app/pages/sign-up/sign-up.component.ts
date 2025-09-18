import type { OnInit } from '@angular/core';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import type { RegisterRequest } from '../../interfaces/user/user.interface';
import { DisclaimerModalComponent } from '../../components/modals/disclaimer-modal/disclaimer-modal.component';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    ProgressSpinnerModule,
    CheckboxModule,
    DisclaimerModalComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showDisclaimerModal = false;
  private isBrowser = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.initializeForm();

    // Se já estiver logado, redireciona para home
    if (this.authService.isLoggedIn) {
      void this.router.navigate(['/projects']);
    } else {
      // Ao entrar na tela, exibe o disclaimer
      this.showDisclaimerModal = true;
    }
  }

  private initializeForm() {
    this.signUpForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
        confirmPassword: ['', [Validators.required]],
        isActive: [true],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  onSubmit() {
    if (this.signUpForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { confirmPassword: _confirmPassword, ...registerData } = this.signUpForm.value;
      const requestData: RegisterRequest = registerData;

      void this.authService.register(requestData).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';
          setTimeout(() => {
            void this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = this.getErrorMessage(error);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Dados inválidos. Verifique as informações fornecidas.';
    } else if (error.status === 409) {
      return 'Nome de usuário ou email já está em uso.';
    } else if (error.status === 0) {
      return 'Erro de conexão. Verifique sua internet.';
    } else if (error.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    } else {
      return 'Erro inesperado. Tente novamente.';
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.signUpForm.controls).forEach((key) => {
      const control = this.signUpForm.get(key);
      control?.markAsTouched();
    });
  }

  onDisclaimerAccepted(): void {
    this.showDisclaimerModal = false;
  }

  onDisclaimerCancelled(): void {
    if (this.isBrowser && window.history.length > 1) {
      this.location.back();
    } else {
      void this.router.navigate(['/projects']);
    }
  }

  get usernameControl() {
    return this.signUpForm.get('username');
  }

  get emailControl() {
    return this.signUpForm.get('email');
  }

  get firstNameControl() {
    return this.signUpForm.get('firstName');
  }

  get lastNameControl() {
    return this.signUpForm.get('lastName');
  }

  get passwordControl() {
    return this.signUpForm.get('password');
  }

  get confirmPasswordControl() {
    return this.signUpForm.get('confirmPassword');
  }

  get isUsernameInvalid() {
    return this.usernameControl?.invalid && this.usernameControl?.touched;
  }

  get isEmailInvalid() {
    return this.emailControl?.invalid && this.emailControl?.touched;
  }

  get isFirstNameInvalid() {
    return this.firstNameControl?.invalid && this.firstNameControl?.touched;
  }

  get isLastNameInvalid() {
    return this.lastNameControl?.invalid && this.lastNameControl?.touched;
  }

  get isPasswordInvalid() {
    return this.passwordControl?.invalid && this.passwordControl?.touched;
  }

  get isConfirmPasswordInvalid() {
    return this.confirmPasswordControl?.invalid && this.confirmPasswordControl?.touched;
  }
}
