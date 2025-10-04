import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DonationService } from '../../services/donation/contribution.service';
import { ContributionService } from '../../services/contribution/contribution.service';
import {
  ContributionsByUser,
  ContributionListItem,
} from '../../interfaces/contribution/contribution.interface';

interface FinancialContribution {
  name: string;
  username: string;
  profileImage: string;
  ranking: number;
}

interface GeneralContribution {
  name: string;
  username: string;
  profileImage: string;
  contributions: { name: string; description: string; link: string }[];
}

@Component({
  selector: 'app-contributions',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, ButtonModule, RippleModule, FormsModule],
  providers: [DonationService],
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.css',
})
export class ContributionsComponent {
  expandedPR: string | null = null;
  expandedIssue: string | null = null;
  financialContributions: FinancialContribution[] = [];

  donationPeriod: 'all' | '30' | '90' | 'custom' = 'all';
  donatedAtStart: string | null = null;
  donatedAtEnd: string | null = null;

  constructor(
    private donationService: DonationService,
    private contributionService: ContributionService,
  ) {
    this.loadFinancialContributions();
    this.loadPRContributions();
    this.loadIssueContributions();
  }

  loadFinancialContributions(): void {
    const params: any = {};
    if (this.donatedAtStart) params.donatedAtStart = this.donatedAtStart;
    if (this.donatedAtEnd) params.donatedAtEnd = this.donatedAtEnd;
    this.donationService.donationRanking(params).subscribe({
      next: (users) => {
        this.financialContributions = users.map((user, idx) => ({
          name: `${user.firstName} ${user.lastName}`.trim(),
          username: user.username,
          profileImage: user.profilePicUrl || '/default_avatar.png',
          ranking: idx + 1,
        }));
      },
      error: () => {
        this.financialContributions = [];
      },
    });
  }

  setDonationPeriod(period: 'all' | '30' | '90' | 'custom') {
    this.donationPeriod = period;
    const now = new Date();
    if (period === 'all') {
      this.donatedAtStart = null;
      this.donatedAtEnd = null;
      this.loadFinancialContributions();
    } else if (period === '30') {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      this.donatedAtStart = start.toISOString().slice(0, 10);
      this.donatedAtEnd = now.toISOString().slice(0, 10);
      this.loadFinancialContributions();
    } else if (period === '90') {
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      this.donatedAtStart = start.toISOString().slice(0, 10);
      this.donatedAtEnd = now.toISOString().slice(0, 10);
      this.loadFinancialContributions();
    }
  }

  prContributions: GeneralContribution[] = [];

  loadPRContributions(): void {
    this.contributionService.findByParamsGroupedByUser({ type: 1, status: 5 }).subscribe({
      next: (response) => {
        const items: ContributionsByUser[] = (response as any).items || response;
        this.prContributions = items.map((userGroup) => ({
          name: `${userGroup.userInfo.firstName} ${userGroup.userInfo.lastName}`.trim(),
          username: userGroup.userInfo.username,
          profileImage: userGroup.userInfo.profilePicUrl || '/default_avatar.png',
          contributions: userGroup.contributions.map((contribution: ContributionListItem) => ({
            name: contribution.name,
            description: contribution.description,
            link: contribution.id ? `https://github.com/m42hub/pull/${contribution.id}` : '',
          })),
        }));
      },
      error: () => {
        this.prContributions = [];
      },
    });
  }

  issueContributions: GeneralContribution[] = [];

  loadIssueContributions(): void {
    this.contributionService.findByParamsGroupedByUser({ type: [2, 3], status: 5 }).subscribe({
      next: (response) => {
        const items: ContributionsByUser[] = response;
        this.issueContributions = items.map((userGroup) => ({
          name: `${userGroup.userInfo.firstName} ${userGroup.userInfo.lastName}`.trim(),
          username: userGroup.userInfo.username,
          profileImage: userGroup.userInfo.profilePicUrl || '/default_avatar.png',
          contributions: userGroup.contributions.map((contribution: ContributionListItem) => ({
            name: contribution.name,
            description: contribution.description,
            link: contribution.id ? `https://github.com/m42hub/issues/${contribution.id}` : '',
          })),
        }));
      },
      error: () => {
        this.issueContributions = [];
      },
    });
  }

  get groupedPRContributions(): GeneralContribution[] {
    const map = new Map<string, GeneralContribution>();
    for (const pr of this.prContributions) {
      if (!map.has(pr.name)) {
        map.set(pr.name, {
          name: pr.name,
          username: pr.username,
          profileImage: pr.profileImage,
          contributions: [...pr.contributions],
        });
      } else {
        const existing = map.get(pr.name);
        if (existing) {
          existing.contributions.push(...pr.contributions);
        }
      }
    }
    return Array.from(map.values());
  }

  togglePR(name: string) {
    this.expandedPR = this.expandedPR === name ? null : name;
  }

  toggleIssue(name: string) {
    this.expandedIssue = this.expandedIssue === name ? null : name;
  }

  get groupedIssueContributions(): GeneralContribution[] {
    const map = new Map<string, GeneralContribution>();
    for (const issue of this.issueContributions) {
      if (!map.has(issue.name)) {
        map.set(issue.name, {
          name: issue.name,
          username: issue.username,
          profileImage: issue.profileImage,
          contributions: [...issue.contributions],
        });
      } else {
        const existing = map.get(issue.name);
        if (existing) {
          existing.contributions.push(...issue.contributions);
        }
      }
    }
    return Array.from(map.values());
  }

  viewProfile(row: { name: string }): void {
    window.open(`/perfil/${row.name}`, '_blank');
  }
}
