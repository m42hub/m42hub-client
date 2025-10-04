import { UserInfo } from '../user/user.interface';

export interface ContributionListItem {
  id: string;
  name: string;
  description: string;
  statusName?: string;
  typeName?: string;
  submittedAt: string;
  approvedAt?: string;
  creationDate: string;
  userInfo: UserInfo;
}

export interface ContributionsByUser {
  userInfo: UserInfo;
  contributions: ContributionListItem[];
}

export interface ContributionSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: number | number[];
  type?: number | number[];
  user?: number | number[];
  submittedAtStart?: string;
  submittedAtEnd?: string;
  approvedAtStart?: string;
  approvedAtEnd?: string;
}
