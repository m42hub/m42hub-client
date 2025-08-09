import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedOption: 'idea' | 'explore' | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  selectOption(option: 'idea' | 'explore') {
    this.selectedOption = option;
  }

  createProject() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/projects/new']);
    } else {
      // Armazena a URL de destino antes de redirecionar para login
      this.authService.setRedirectUrl('/projects/new');
      this.router.navigate(['/login']);
    }
  }

  exploreProjects() {
    this.router.navigate(['/projects']);
  }
}
