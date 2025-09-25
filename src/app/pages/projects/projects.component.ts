import type { OnInit, OnDestroy } from '@angular/core';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectSummaryCardComponent } from '../../components/cards/project-summary-card/project-summary-card.component';
import { ProjectFilterComponent } from '../../components/filters/project-filter/project-filter.component';
import type { Project, ProjectSearchParams } from '../../interfaces/project/project.interface';
import { ProjectService } from '../../services/project/project.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    MultiSelectModule,
    InputTextModule,
    CardModule,
    TooltipModule,
    ProjectSummaryCardComponent,
    ProjectFilterComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  isLoading = true;
  pageSize = 3;
  currentPage = 1;
  totalPages = 1;
  totalElements = 0;
  showFilters = false;
  Math = Math;

  filters: ProjectSearchParams = { page: 0, limit: this.pageSize };

  private readonly breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xl2: 1536,
  };

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.handleResponsivePageSize();
    if (this.isBrowser()) {
      this.loadProjects();
    }
  }

  ngOnDestroy(): void {
    // Método intencionalmente vazio para cumprir interface OnDestroy
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser()) {
      this.handleResponsivePageSize();
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private handleResponsivePageSize(): void {
    if (!this.isBrowser()) return;
    const width = window.innerWidth;
    const newPageSize = this.getPageSizeForWidth(width);
    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.filters.limit = this.pageSize;
      this.currentPage = 1;
      if (this.projects.length > 0 || this.totalElements > 0) {
        this.loadProjects();
      }
    }
  }

  private getPageSizeForWidth(width: number): number {
    if (width < this.breakpoints.lg) return 1;
    if (width < this.breakpoints.xl2) return 2;
    return 3;
  }

  private buildSearchParams(): ProjectSearchParams {
    const { sortBy, sortDirection, complexity, status, tools, topics, unfilledRoles } =
      this.filters;
    const params: ProjectSearchParams = {
      page: this.currentPage - 1,
      limit: this.pageSize,
    };
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortDirection = sortDirection;
    }
    this.addIfValid(params, 'complexity', complexity);
    this.addIfValid(params, 'status', status);
    this.addIfValid(params, 'tools', tools);
    this.addIfValid(params, 'topics', topics);
    this.addIfValid(params, 'unfilledRoles', unfilledRoles);
    return params;
  }

  private addIfValid<T>(
    params: ProjectSearchParams,
    key: keyof ProjectSearchParams,
    value: T | T[],
  ): void {
    if (value && (!Array.isArray(value) || value.length > 0)) {
      params[key] = value as any;
    }
  }

  loadProjects(): void {
    this.isLoading = true;
    if (!this.isBrowser()) return;
    const searchParams = this.buildSearchParams();
    this.projectService.search(searchParams).subscribe({
      next: (res) => this.handleProjectsResponse(res),
      error: (error) => this.handleProjectsError(error),
      complete: () => (this.isLoading = false),
    });
  }

  private handleProjectsResponse(res: any): void {
    this.projects = res.content;
    this.totalPages = res.pagination.totalPages;
    this.totalElements = res.pagination.totalElements;
    this.isLoading = false;
  }

  private handleProjectsError(error: any): void {
    console.error('Erro ao carregar projetos:', error);
    this.projects = [];
    this.totalPages = 1;
    this.totalElements = 0;
  }

  onFiltersChange(newFilters: ProjectSearchParams): void {
    this.filters = { ...newFilters, limit: this.pageSize };
    this.currentPage = (this.filters.page || 0) + 1;
    this.loadProjects();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProjects();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProjects();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProjects();
    }
  }

  onPageSizeChange(): void {
    this.filters.limit = this.pageSize;
    this.currentPage = 1;
    this.loadProjects();
  }

  createNewProject(): void {
    if (this.authService.isLoggedIn) {
      void this.router.navigate(['/projects/new']);
    } else {
      this.authService.setRedirectUrl('/projects/new');
      void this.router.navigate(['/login']);
    }
  }
}
