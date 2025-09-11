// ...existing code...
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
  @Input() useOfficialColors = false;
  @Input() iconsOnly = false;

  private stripProtocol(url: string | null | undefined): string {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '');
  }

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
  get isDiscordLink(): boolean {
    return (
      !!this.discord &&
      (this.discord.startsWith('http://') ||
        this.discord.startsWith('https://') ||
        this.discord.startsWith('discord.gg/') ||
        this.discord.startsWith('www.discord.gg'))
    );
  }
  get discordUrl(): string | null {
    if (!this.discord) {
      return null;
    }
    if (this.discord.startsWith('http://') || this.discord.startsWith('https://')) {
      return this.discord;
    }
    if (this.discord.startsWith('discord.gg/') || this.discord.startsWith('www.discord.gg')) {
      return `https://${this.discord.replace(/^www\./, '')}`;
    }
    return null;
  }
  get discordDisplay(): string {
    return this.stripProtocol(this.discord);
  }
  get linkedinDisplay(): string {
    return this.stripProtocol(this.linkedinUrl);
  }
  get githubDisplay(): string {
    return this.github || '';
  }
  get personalWebsiteDisplay(): string {
    return this.stripProtocol(this.personalWebsiteUrl);
  }
  get discordIconClass() {
    return this.useOfficialColors ? 'text-[#5865F2]' : '';
  }
  get linkedinIconClass() {
    return this.useOfficialColors ? 'text-[#0A66C2]' : '';
  }
  get githubIconClass() {
    return this.useOfficialColors ? 'text-black' : '';
  }
  get globeIconClass() {
    return this.useOfficialColors ? 'text-blue-500' : '';
  }
}
