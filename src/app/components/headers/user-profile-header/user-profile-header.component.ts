import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import type { UserInfo } from '../../../interfaces/user/user.interface';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SocialMediaCardComponent } from '../../cards/social-media-card/social-media-card.component';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-profile-header',
  standalone: true,
  imports: [CommonModule, AvatarModule, CardModule, DialogModule, SocialMediaCardComponent],
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
  hoverAvatar = false;
  uploading = false;
  uploadError: string | null = null;

  userService = inject(UserService);

  openChangePicModal() {
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
    this.userService.changeProfilePic((this.userInfo as UserInfo).username, file).subscribe({
      next: (updated: unknown) => {
        const user = updated as UserInfo;
        this.uploading = false;
        this.showChangePicModal = false;
        if (this.userInfo) {
          this.userInfo = { ...this.userInfo, profilePicUrl: user.profilePicUrl };
        }
        this.profilePicChanged.emit(user.profilePicUrl);
      },
      error: (_err: unknown) => {
        this.uploading = false;
        this.uploadError = 'Falha ao enviar imagem.';
      },
    });
  }
}
