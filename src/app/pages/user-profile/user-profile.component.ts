import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserService } from '../../services/user/user.service';
import type { UserInfo } from '../../interfaces/user/user.interface';
import { UserProfileHeaderComponent } from '../../components/headers/user-profile-header/user-profile-header.component';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    CardModule,
    TagModule,
    DividerModule,
    ButtonModule,
    ProgressSpinnerModule,
    UserProfileHeaderComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  userInfo: UserInfo | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.userInfo = user;
          this.loading = false;
        },
        error: () => {
          this.error = 'Usuário não encontrado ou erro ao carregar.';
          this.loading = false;
        },
      });
    } else {
      this.error = 'Nome de usuário não fornecido.';
      this.loading = false;
    }
  }
}
