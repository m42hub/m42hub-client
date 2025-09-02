import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  photo?: string;
  username: string;
  isManager?: boolean;
}

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, TooltipModule, AvatarModule, ButtonModule],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css',
})
export class TeamCardComponent implements OnChanges {
  @Input() team: TeamMember[] = [];
  @Input() mode: 'display' | 'edit' = 'display';
  @Input() showHeader = true;
  @Input() maxHeight = 'auto';

  defaultAvatar = '/default_avatar.png';
  teamWithPhotoUrl: Array<TeamMember & { photoUrl: string }> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['team']) {
      this.teamWithPhotoUrl = (this.team || []).map((member) => ({
        ...member,
        photoUrl: member.photo || this.defaultAvatar,
      }));
    }
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  viewProfile(username: string): void {
    window.open(`/user/${username}`, '_blank');
  }
}
