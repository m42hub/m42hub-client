import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import type { Observable } from 'rxjs';
import type { User } from '../../../interfaces/user/user.interface';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, CommonModule, TagModule, AvatarModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  darkMode = false;
  user$: Observable<User | null>;
  showLogoutError = false;
  showProfileMenu = false;
  profileMenuItems: MenuItem[] = [];

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
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          html.classList.add('dark');
          localStorage.setItem('theme', 'dark');
          this.darkMode = true;
        } else {
          this.darkMode = false;
        }
      }
    }

    this.user$.subscribe((user) => {
      if (user) {
        this.profileMenuItems = [
          {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => this.handleClick(`/user/${user.username}`),
          },
          {
            label: 'Meus Projetos',
            icon: 'pi pi-folder',
            command: () => this.handleClick(`/projects/user/${user.username}`),
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.onLogout(),
          },
        ];
      } else {
        this.profileMenuItems = [
          {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => this.handleClick(`/user-profile`),
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.onLogout(),
          },
        ];
      }
    });
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.user$ = this.authService.user$;
  }
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  onEditProfile() {
    this.showProfileMenu = false;
    this.user$
      .subscribe((user) => {
        if (user && user.username) {
          void this.router.navigate([`/user/${user.username}`]);
        }
      })
      .unsubscribe();
  }

  handleClick(path: string) {
    void this.router.navigate([path]);
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
      window.location.reload();
    }
  }

  onLogin() {
    void this.router.navigate(['/login']);
  }

  onLogout() {
    this.showProfileMenu = false;
    this.authService.logout().subscribe({
      next: () => {
        void this.router.navigate(['/']);
      },
      error: () => {
        this.showLogoutError = true;
      },
    });
  }
}
