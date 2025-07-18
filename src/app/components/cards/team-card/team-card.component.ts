import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-team-card',
  imports: [TagModule, TooltipModule],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css'
})
export class TeamCardComponent {
  @Input() team: any[] = [];
  defaultAvatar = '/default_avatar.png';

  getImageUrl(imageUrl: string): string {
    return imageUrl || this.defaultAvatar;
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }
}
