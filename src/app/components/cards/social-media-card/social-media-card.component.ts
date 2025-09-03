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

  get linkedinUrl(): string | null {
    return this.linkedin ? `https://www.linkedin.com/in/${this.linkedin}` : null;
  }
  get githubUrl(): string | null {
    return this.github ? `https://github.com/${this.github}` : null;
  }
  get personalWebsiteUrl(): string | null {
    return this.personalWebsite
      ? this.personalWebsite.startsWith('http')
        ? this.personalWebsite
        : `https://${this.personalWebsite}`
      : null;
  }
}
