import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

export interface TeamRequest {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  requestedRole: string;
  message?: string;
  requestedAt: Date;
}

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, TooltipModule, ButtonModule, AvatarModule],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.css'
})
export class RequestCardComponent {
  @Input() requests: TeamRequest[] = [];
  @Input() showHeader: boolean = true;
  @Input() maxHeight: string = 'auto';

  @Output() acceptRequest = new EventEmitter<TeamRequest>();
  @Output() rejectRequest = new EventEmitter<TeamRequest>();

  defaultAvatar = '/default_avatar.png';

  getImageUrl(imageUrl?: string): string {
    return imageUrl || this.defaultAvatar;
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  onAcceptRequest(request: TeamRequest): void {
    this.acceptRequest.emit(request);
  }

  onRejectRequest(request: TeamRequest): void {
    this.rejectRequest.emit(request);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
