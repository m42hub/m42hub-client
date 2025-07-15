import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [ButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  darkMode = false;

  toggleDarkMode() {
    const html = document.documentElement;

    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      html.classList.add('my-app-dark');
    } else {
      html.classList.remove('my-app-dark');
    }
  }
}
