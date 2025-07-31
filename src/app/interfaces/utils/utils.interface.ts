export interface PaginatedResponse<T> {
  content: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
  };
}
