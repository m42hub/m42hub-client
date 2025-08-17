import { Component, OnInit, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../interfaces/user/user.interface';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, CommonModule, TagModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  darkMode = false;
  user$: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.user$ = this.authService.user$;
  }

  handleClick(path: string) {
    this.router.navigate([path]);
  }

  //TODO: Validar se realmente é assim que faz o togle de theme
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const html = document.documentElement;
      if (savedTheme) {
        if (savedTheme === 'dark') {
          html.classList.add('dark');
          this.darkMode = true;
        } else {
          html.classList.remove('dark');
          this.darkMode = false;
        }
      } else {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        if (prefersDark) {
          html.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          this.darkMode = true;
        } else {
          this.darkMode = false;
        }
      }
    }
  }

  toggleDarkMode() {
    if (isPlatformBrowser(this.platformId)) {
      const html = document.documentElement;
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erro ao fazer logout:', error);
        // Mesmo com erro, limpa o estado local e redireciona
        this.router.navigate(['/']);
      },
    });
  }
}
