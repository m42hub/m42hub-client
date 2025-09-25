import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

interface FinancialContribution {
  name: string;
  username: string;
  profileImage: string;
  ranking: number;
}

interface PRContribution {
  name: string;
  username: string;
  profileImage: string;
  prs: { description: string; link: string }[];
}

interface IssueContribution {
  name: string;
  username: string;
  profileImage: string;
  issues: { description: string; link?: string }[];
}

@Component({
  selector: 'app-contributions',
  standalone: true,
  imports: [CommonModule, TableModule, AvatarModule, ButtonModule, RippleModule],
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.css',
})
export class ContributionsComponent {
  expandedPR: string | null = null;
  expandedIssue: string | null = null;
  financialContributions: FinancialContribution[] = [
    { name: 'Alice', username: 'alices', profileImage: '/default_avatar.png', ranking: 1 },
    { name: 'Bob', username: 'bobs', profileImage: '/default_avatar.png', ranking: 2 },
    { name: 'Carol', username: 'carols', profileImage: '/default_avatar.png', ranking: 3 },
  ];

  prContributions: PRContribution[] = [
    {
      name: 'Daniel Luiz da Silva',
      username: 'danis',
      profileImage: '/default_avatar.png',
      prs: [
        { description: 'Corrigiu bug de autenticação', link: 'https://github.com/m42hub/pull/1' },
        {
          description: 'Melhorou performance do dashboard',
          link: 'https://github.com/m42hub/pull/2',
        },
      ],
    },
    {
      name: 'Eva',
      username: 'evas',
      profileImage: '/default_avatar.png',
      prs: [{ description: 'Adicionou tema escuro', link: 'https://github.com/m42hub/pull/3' }],
    },
    {
      name: 'Daniel Luiz da Silva',
      username: 'danis',
      profileImage: '/default_avatar.png',
      prs: [
        { description: 'Refatorou componente de login', link: 'https://github.com/m42hub/pull/4' },
      ],
    },
  ];

  issueContributions: IssueContribution[] = [
    {
      name: 'Frank',
      profileImage: '/default_avatar.png',
      username: 'franks',
      issues: [
        { description: 'Sugestão: Adicionar integração com Discord' },
        { description: 'Issue: Erro ao salvar perfil', link: 'https://github.com/m42hub/issues/1' },
      ],
    },
    {
      name: 'Grace',
      username: 'graces',
      profileImage: '/default_avatar.png',
      issues: [{ description: 'Sugestão: Melhorar responsividade' }],
    },
    {
      name: 'Frank',
      username: 'franks',
      profileImage: '/default_avatar.png',
      issues: [
        {
          description: 'Issue: Corrigir layout mobile',
          link: 'https://github.com/m42hub/issues/2',
        },
      ],
    },
  ];

  get groupedPRContributions(): PRContribution[] {
    const map = new Map<string, PRContribution>();
    for (const pr of this.prContributions) {
      if (!map.has(pr.name)) {
        map.set(pr.name, {
          name: pr.name,
          username: pr.username,
          profileImage: pr.profileImage,
          prs: [...pr.prs],
        });
      } else {
        const existing = map.get(pr.name);
        if (existing) {
          existing.prs.push(...pr.prs);
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

  get groupedIssueContributions(): IssueContribution[] {
    const map = new Map<string, IssueContribution>();
    for (const issue of this.issueContributions) {
      if (!map.has(issue.name)) {
        map.set(issue.name, {
          name: issue.name,
          username: issue.username,
          profileImage: issue.profileImage,
          issues: [...issue.issues],
        });
      } else {
        const existing = map.get(issue.name);
        if (existing) {
          existing.issues.push(...issue.issues);
        }
      }
    }
    return Array.from(map.values());
  }

  viewProfile(row: { name: string }): void {
    window.open(`/perfil/${row.name}`, '_blank');
  }
}
