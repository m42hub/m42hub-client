import { FormControl, Validators } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

export interface TeamRequest {
  id: string;
  name: string;
  role: string;
  photo: string;
  username: string;
  applicationMessage?: string;
  createdAt: Date;
  photoUrl?: string;
  createdAtFormatted?: string;
  feedback?: string;
}

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    TooltipModule,
    ButtonModule,
    AvatarModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.css',
})
export class RequestCardComponent implements OnChanges {
  feedbackDialogVisible = false;
  feedbackTextControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  feedbackRequest: TeamRequest | null = null;
  get requestsWithFormattedDate(): Array<
    TeamRequest & {
      createdAtFormatted?: string;
      photoUrl?: string;
    }
  > {
    return this.requests.map((r) => ({
      ...r,
      createdAtFormatted: r.createdAt ? new Date(r.createdAt).toLocaleDateString('pt-BR') : '',
      photoUrl: r.photo || this.defaultAvatar,
    }));
  }
  @Input() requests: TeamRequest[] = [];
  @Input() showHeader = true;
  @Input() maxHeight = 'auto';

  @Output() acceptRequest = new EventEmitter<TeamRequest>();
  @Output() rejectRequest = new EventEmitter<TeamRequest>();

  defaultAvatar = '/default_avatar.png';

  ngOnChanges() {
    this.requests.forEach((request) => {
      request.photoUrl = request.photo || this.defaultAvatar;
      request.createdAtFormatted = request.createdAt
        ? new Date(request.createdAt).toLocaleDateString('pt-BR')
        : '';
    });
  }

  onAcceptRequest(request: TeamRequest): void {
    this.acceptRequest.emit(request);
  }

  onRejectRequest(request: TeamRequest): void {
    this.feedbackRequest = request;
    this.feedbackTextControl.reset('');
    this.feedbackDialogVisible = true;
  }

  confirmRejectRequest(): void {
    if (!this.feedbackRequest?.id) {
      return;
    }
    const feedback = this.feedbackTextControl.value || '';
    this.rejectRequest.emit({ ...this.feedbackRequest, feedback });
    this.closeFeedbackDialog();
  }

  closeFeedbackDialog(): void {
    this.feedbackDialogVisible = false;
    this.feedbackTextControl.reset('');
    this.feedbackRequest = null;
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
