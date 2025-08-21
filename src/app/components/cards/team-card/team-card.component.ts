import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';

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
  imports: [CommonModule, CardModule, TagModule, TooltipModule, AvatarModule],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css',
})
export class TeamCardComponent {
  @Input() team: TeamMember[] = [];
  @Input() mode: 'display' | 'edit' = 'display';
  @Input() showHeader = true;
  @Input() maxHeight = 'auto';

  @Output() removeMember = new EventEmitter<{ index: number; member: TeamMember }>();
  @Output() editMember = new EventEmitter<{ index: number; member: TeamMember }>();

  defaultAvatar = '/default_avatar.png';

  get teamWithPhotoUrl(): Array<TeamMember & { photoUrl: string }> {
    return this.team.map((member) => ({
      ...member,
      photoUrl: member.photo || this.defaultAvatar,
    }));
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  onRemoveMember(index: number, member: TeamMember): void {
    this.removeMember.emit({ index, member });
  }

  onEditMember(index: number, member: TeamMember): void {
    this.editMember.emit({ index, member });
  }
}
