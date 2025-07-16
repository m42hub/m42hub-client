import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  darkMode = false;

  constructor(private router: Router) {}

  handleClick(path: string) {
    this.router.navigate([path]);
  }

  //TODO: Validar se realmente é assim que faz o togle de theme
  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    if (savedTheme) {
      if (savedTheme === 'dark') {
        html.classList.add('my-app-dark');
        this.darkMode = true;
      } else {
        html.classList.remove('my-app-dark');
        this.darkMode = false;
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add('my-app-dark');
        localStorage.setItem('theme', 'dark');
        this.darkMode = true;
      } else {
        this.darkMode = false;
      }
    }
  }

  toggleDarkMode() {
    const html = document.documentElement;
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      html.classList.add('my-app-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('my-app-dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
