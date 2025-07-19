import { Component, OnInit, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  darkMode = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
}
