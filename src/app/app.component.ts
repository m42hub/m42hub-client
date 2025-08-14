import { Component, OnInit, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { HeaderComponent } from "./components/layout/header/header.component";
import { FooterComponent } from "./components/layout/footer/footer.component";
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'm42hub-client';

  constructor(private primeng: PrimeNG, private authService: AuthService) {
    // Inicializa a autenticação apenas após a hidratação no cliente
    afterNextRender(() => {
      this.authService.initializeAuth().subscribe();
    });
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
