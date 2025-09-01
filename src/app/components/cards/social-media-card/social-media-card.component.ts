import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-media-card',
  templateUrl: './social-media-card.component.html',
  styleUrl: './social-media-card.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class SocialMediaCardComponent {
  @Input() discord?: string;
  @Input() linkedin?: string;
  @Input() github?: string;
  @Input() personalWebsite?: string;
}
