export interface DonationSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: number | number[];
  type?: number | number[];
  platform?: number | number[];
  user?: number | number[];
  donatedAtStart?: string;
  donatedAtEnd?: string;
  minTotalAmount?: number;
  maxTotalAmount?: number;
}
