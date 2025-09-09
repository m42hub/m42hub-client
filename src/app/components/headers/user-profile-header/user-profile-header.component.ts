import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import type { UserInfo } from '../../../interfaces/user/user.interface';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SocialMediaCardComponent } from '../../cards/social-media-card/social-media-card.component';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-profile-header',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    CardModule,
    DialogModule,
    ButtonModule,
    SocialMediaCardComponent,
  ],
  templateUrl: './user-profile-header.component.html',
  styleUrls: ['./user-profile-header.component.css'],
})
export class UserProfileHeaderComponent {
  @Input() userInfo: UserInfo | null = null;
  @Input() loading = false;
  @Input() isOwnProfile = false;
  @Output() profilePicChanged = new EventEmitter<string>();

  defaultAvatar = '/default_avatar.png';
  showChangePicModal = false;
  changePicType: 'profile' | 'banner' = 'profile';
  hoverAvatar = false;
  uploading = false;
  uploadError: string | null = null;

  userService = inject(UserService);

  openChangePicModal(type: 'profile' | 'banner') {
    this.changePicType = type;
    this.showChangePicModal = true;
    this.uploadError = null;
  }

  closeChangePicModal() {
    this.showChangePicModal = false;
    this.uploadError = null;
  }

  triggerFileInput(input: HTMLInputElement) {
    input.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0] || !this.userInfo) return;
    const file = input.files[0];
    this.uploading = true;
    this.uploadError = null;
    const username = this.userInfo.username;
    let upload$;
    if (this.changePicType === 'profile') {
      upload$ = this.userService.changeProfilePic(username, file);
    } else {
      upload$ = this.userService.changeBannerPic(username, file);
    }
    upload$.subscribe({
      next: (updated: unknown) => {
        const user = updated as UserInfo;
        this.uploading = false;
        this.showChangePicModal = false;
        if (this.userInfo) {
          if (this.changePicType === 'profile') {
            this.userInfo = { ...this.userInfo, profilePicUrl: user.profilePicUrl };
            this.profilePicChanged.emit(user.profilePicUrl);
          } else {
            this.userInfo = { ...this.userInfo, profileBannerUrl: user.profileBannerUrl };
          }
        }
      },
      error: (_err: unknown) => {
        this.uploading = false;
        this.uploadError = 'Falha ao enviar imagem.';
      },
    });
  }
}
