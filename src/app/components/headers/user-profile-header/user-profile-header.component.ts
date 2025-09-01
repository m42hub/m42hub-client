import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { SocialMediaCardComponent } from '../../cards/social-media-card/social-media-card.component';
import type { UserInfo } from '../../../interfaces/user/user.interface';

@Component({
  selector: 'app-user-profile-header',
  standalone: true,
  imports: [CommonModule, AvatarModule, CardModule, SocialMediaCardComponent],
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.css'],
})
export class UserProfileHeaderComponent {
  @Input() userInfo: UserInfo | null = null;
  @Input() loading = false;

  defaultAvatar = '/default_avatar.png';

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }
}
