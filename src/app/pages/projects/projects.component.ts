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
  pageSize = 3;
  currentPage = 1;
  totalPages = 1;
  totalElements = 0;

  Math = Math;

  showFilters = false;

  filters: ProjectSearchParams = {
    page: 0,
    limit: this.pageSize,
  };

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.updatePageSizeForScreen();
    if (isPlatformBrowser(this.platformId)) {
      this.loadProjects();
    }
  }

  ngOnDestroy(): void {
    // Método intencionalmente vazio para cumprir interface OnDestroy
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updatePageSizeForScreen();
    }
  }

  private breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xl2: 1536,
  };

  private updatePageSizeForScreen(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const width = window.innerWidth;
    let newPageSize: number;

    if (width < this.breakpoints.lg) {
      newPageSize = 1;
    } else if (width < this.breakpoints.xl2) {
      newPageSize = 2;
    } else {
      newPageSize = 3;
    }

    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.filters.limit = this.pageSize;
      this.currentPage = 1;

      if (this.projects.length > 0 || this.totalElements > 0) {
        this.loadProjects();
      }
    }
  }

  loadProjects(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const searchParams: ProjectSearchParams = {
      page: this.currentPage - 1,
      limit: this.pageSize,
    };

    if (this.filters.sortBy) {
      searchParams.sortBy = this.filters.sortBy;
      searchParams.sortDirection = this.filters.sortDirection;
    }

    if (
      this.filters.complexity &&
      (Array.isArray(this.filters.complexity) ? this.filters.complexity.length > 0 : true)
    ) {
      searchParams.complexity = this.filters.complexity;
    }

    if (
      this.filters.status &&
      (Array.isArray(this.filters.status) ? this.filters.status.length > 0 : true)
    ) {
      searchParams.status = this.filters.status;
    }

    if (
      this.filters.tools &&
      (Array.isArray(this.filters.tools) ? this.filters.tools.length > 0 : true)
    ) {
      searchParams.tools = this.filters.tools;
    }

    if (
      this.filters.topics &&
      (Array.isArray(this.filters.topics) ? this.filters.topics.length > 0 : true)
    ) {
      searchParams.topics = this.filters.topics;
    }

    if (
      this.filters.unfilledRoles &&
      (Array.isArray(this.filters.unfilledRoles) ? this.filters.unfilledRoles.length > 0 : true)
    ) {
      searchParams.unfilledRoles = this.filters.unfilledRoles;
    }

    this.projectService.search(searchParams).subscribe({
      next: (res) => {
        this.projects = res.content;
        this.totalPages = res.pagination.totalPages;
        this.totalElements = res.pagination.totalElements;
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.projects = [];
        this.totalPages = 1;
        this.totalElements = 0;
      },
    });
  }

  onFiltersChange(newFilters: ProjectSearchParams): void {
    this.filters = { ...newFilters, limit: this.pageSize };
    this.currentPage = (this.filters.page || 0) + 1;
    this.loadProjects();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProjects();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProjects();
    }
  }

  createNewProject(): void {
    if (this.authService.isLoggedIn) {
      void this.router.navigate(['/projects/new']);
    } else {
      this.authService.setRedirectUrl('/projects/new');
      void this.router.navigate(['/login']);
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
}
