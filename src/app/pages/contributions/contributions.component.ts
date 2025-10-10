import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
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
  profileBannerUrl?: string;
  ranking: number;
}

interface GeneralContribution {
  name: string;
  username: string;
  profileImage: string;
  profileBannerUrl: string;
  contributions: { name: string; description: string; link: string | null }[];
}

@Component({
  selector: 'app-contributions',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    ButtonModule,
    RippleModule,
    FormsModule,
    TooltipModule,
  ],
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
          profileBannerUrl: user.profileBannerUrl,
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

  prPeriod: 'all' | '30' | '90' | 'custom' = 'all';
  approvedAtStartPR: string | null = null;
  approvedAtEndPR: string | null = null;
  prContributions: GeneralContribution[] = [];

  setPRPeriod(period: 'all' | '30' | '90' | 'custom') {
    this.prPeriod = period;
    const now = new Date();
    if (period === 'all') {
      this.approvedAtStartPR = null;
      this.approvedAtEndPR = null;
      this.loadPRContributions();
    } else if (period === '30') {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      this.approvedAtStartPR = start.toISOString().slice(0, 10);
      this.approvedAtEndPR = now.toISOString().slice(0, 10);
      this.loadPRContributions();
    } else if (period === '90') {
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      this.approvedAtStartPR = start.toISOString().slice(0, 10);
      this.approvedAtEndPR = now.toISOString().slice(0, 10);
      this.loadPRContributions();
    }
  }

  loadPRContributions(): void {
    const params: any = { type: 1, status: 5 };
    if (this.approvedAtStartPR) params.approvedAtStart = this.approvedAtStartPR;
    if (this.approvedAtEndPR) params.approvedAtEnd = this.approvedAtEndPR;
    this.contributionService.findByParamsGroupedByUser(params).subscribe({
      next: (response) => {
        const items: ContributionsByUser[] = (response as any).items || response;
        this.prContributions = items.map((userGroup) => ({
          name: `${userGroup.userInfo.firstName} ${userGroup.userInfo.lastName}`.trim(),
          username: userGroup.userInfo.username,
          profileImage: userGroup.userInfo.profilePicUrl || '/default_avatar.png',
          profileBannerUrl: userGroup.userInfo.profileBannerUrl,
          contributions: userGroup.contributions.map((contribution: ContributionListItem) => ({
            name: contribution.name,
            description: contribution.description,
            link: contribution.link || null,
          })),
        }));
      },
      error: () => {
        this.prContributions = [];
      },
    });
  }

  issuePeriod: 'all' | '30' | '90' | 'custom' = 'all';
  approvedAtStartIssue: string | null = null;
  approvedAtEndIssue: string | null = null;
  issueContributions: GeneralContribution[] = [];

  setIssuePeriod(period: 'all' | '30' | '90' | 'custom') {
    this.issuePeriod = period;
    const now = new Date();
    if (period === 'all') {
      this.approvedAtStartIssue = null;
      this.approvedAtEndIssue = null;
      this.loadIssueContributions();
    } else if (period === '30') {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      this.approvedAtStartIssue = start.toISOString().slice(0, 10);
      this.approvedAtEndIssue = now.toISOString().slice(0, 10);
      this.loadIssueContributions();
    } else if (period === '90') {
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      this.approvedAtStartIssue = start.toISOString().slice(0, 10);
      this.approvedAtEndIssue = now.toISOString().slice(0, 10);
      this.loadIssueContributions();
    }
  }

  loadIssueContributions(): void {
    const params: any = { type: [2, 3], status: 5 };
    if (this.approvedAtStartIssue) params.approvedAtStart = this.approvedAtStartIssue;
    if (this.approvedAtEndIssue) params.approvedAtEnd = this.approvedAtEndIssue;
    this.contributionService.findByParamsGroupedByUser(params).subscribe({
      next: (response) => {
        const items: ContributionsByUser[] = response;
        this.issueContributions = items.map((userGroup) => ({
          name: `${userGroup.userInfo.firstName} ${userGroup.userInfo.lastName}`.trim(),
          username: userGroup.userInfo.username,
          profileImage: userGroup.userInfo.profilePicUrl || '/default_avatar.png',
          profileBannerUrl: userGroup.userInfo.profileBannerUrl,
          contributions: userGroup.contributions.map((contribution: ContributionListItem) => ({
            name: contribution.name,
            description: contribution.description,
            link: contribution.link || null,
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
          profileBannerUrl: pr.profileBannerUrl,
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
          profileBannerUrl: issue.profileBannerUrl,
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

  viewProfile(username: string): void {
    window.open(`/user/${username}`, '_blank');
  }
}
