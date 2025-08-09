import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectsComponent as ProjectCardComponent } from '../../components/cards/projects/projects.component';
import { ProjectSummaryCardComponent } from '../../components/cards/project-summary-card/project-summary-card.component';
import { Project, ProjectSearchParams } from '../../interfaces/project/project.interface';
import { ProjectService } from '../../services/project/project.service';
import { ProjectComplexityService } from '../../services/project/complexity.service';
import { ProjectStatusService } from '../../services/project/status.service';
import { ProjectToolService } from '../../services/project/tool.service';
import { ProjectTopicService } from '../../services/project/topic.service';
import { ProjectRoleService } from '../../services/project/role.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProjectComplexity } from '../../interfaces/project/complexity.interface';
import { ProjectStatus } from '../../interfaces/project/status.interface';
import { ProjectTool } from '../../interfaces/project/tool.interface';
import { ProjectTopic } from '../../interfaces/project/topic.interface';
import { ProjectRole } from '../../interfaces/project/role.interface';

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

  // Expose Math for template
  Math = Math;

  // Controle de exibição dos filtros
  showFilters = false;

  // Dados para os filtros
  complexities: ProjectComplexity[] = [];
  statuses: ProjectStatus[] = [];
  tools: ProjectTool[] = [];
  topics: ProjectTopic[] = [];
  roles: ProjectRole[] = [];

  // Filtros
  filters: ProjectSearchParams = {
    page: 0,
    limit: this.pageSize,
  };

  sortOptions = [
    { label: 'Nome (A-Z)', value: { sortBy: 'name', sortDirection: 'ASC' } },
    { label: 'Nome (Z-A)', value: { sortBy: 'name', sortDirection: 'DESC' } },
    {
      label: 'Mais Recentes (Criação)',
      value: { sortBy: 'createdAt', sortDirection: 'DESC' },
    },
    {
      label: 'Mais Antigos (Criação)',
      value: { sortBy: 'createdAt', sortDirection: 'ASC' },
    },
    {
      label: 'Mais Recentes (Início)',
      value: { sortBy: 'startDate', sortDirection: 'DESC' },
    },
    {
      label: 'Mais Antigos (Início)',
      value: { sortBy: 'startDate', sortDirection: 'ASC' },
    },
  ];

  selectedSort: any = null;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private complexityService: ProjectComplexityService,
    private statusService: ProjectStatusService,
    private toolService: ProjectToolService,
    private topicService: ProjectTopicService,
    private roleService: ProjectRoleService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.updatePageSizeForScreen();
    this.loadFilterData();
    this.loadProjects();
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updatePageSizeForScreen();
    }
  }

  // Breakpoints para responsividade
  private breakpoints = {
    sm: 640, // Tailwind sm breakpoint
    md: 768, // Tailwind md breakpoint
    lg: 1024, // Tailwind lg breakpoint
  };

  private updatePageSizeForScreen(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const width = window.innerWidth;
    let newPageSize: number;

    if (width < this.breakpoints.sm) {
      // Extra small screens: 1 item
      newPageSize = 1;
    } else if (width < this.breakpoints.md) {
      // Small screens: 1 item
      newPageSize = 2;
    } else if (width < this.breakpoints.lg) {
      // Medium screens: 2 items
      newPageSize = 3;
    } else {
      // Large screens and above: 3 items
      newPageSize = 3;
    }

    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.filters.limit = this.pageSize;
      this.currentPage = 1; // Reset to first page when page size changes

      // Só recarrega os projetos se o componente já foi inicializado
      if (this.projects.length > 0 || this.totalElements > 0) {
        this.loadProjects();
      }
    }
  }

  loadFilterData(): void {
    // Carregar dados para os filtros
    this.complexityService.getAll().subscribe((complexities) => {
      this.complexities = complexities;
    });

    this.statusService.getAll().subscribe((statuses) => {
      this.statuses = statuses;
    });

    this.toolService.getAll().subscribe((tools) => {
      this.tools = tools;
    });

    this.topicService.getAll().subscribe((topics) => {
      this.topics = topics;
    });

    this.roleService.getAll().subscribe((roles) => {
      this.roles = roles;
    });
  }

  loadProjects(): void {
    // Limpar valores undefined/null antes de enviar
    const searchParams: ProjectSearchParams = {
      page: this.currentPage - 1,
      limit: this.pageSize,
    };

    // Adicionar filtros apenas se tiverem valor
    if (this.filters.sortBy) {
      searchParams.sortBy = this.filters.sortBy;
      searchParams.sortDirection = this.filters.sortDirection;
    }

    if (
      this.filters.complexity &&
      (Array.isArray(this.filters.complexity)
        ? this.filters.complexity.length > 0
        : true)
    ) {
      searchParams.complexity = this.filters.complexity;
    }

    if (
      this.filters.status &&
      (Array.isArray(this.filters.status)
        ? this.filters.status.length > 0
        : true)
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
      (Array.isArray(this.filters.topics)
        ? this.filters.topics.length > 0
        : true)
    ) {
      searchParams.topics = this.filters.topics;
    }

    if (
      this.filters.unfilledRoles &&
      (Array.isArray(this.filters.unfilledRoles)
        ? this.filters.unfilledRoles.length > 0
        : true)
    ) {
      searchParams.unfilledRoles = this.filters.unfilledRoles;
    }

    console.log('Parâmetros de busca:', searchParams); // Para debug

    this.projectService.search(searchParams).subscribe({
      next: (res) => {
        this.projects = res.content;
        this.totalPages = res.pagination.totalPages;
        this.totalElements = res.pagination.totalElements;
        console.log('Projetos carregados:', res); // Para debug
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.projects = [];
        this.totalPages = 1;
        this.totalElements = 0;
      },
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProjects();
  }

  onSortChange(): void {
    if (this.selectedSort && this.selectedSort.value) {
      this.filters.sortBy = this.selectedSort.value.sortBy;
      this.filters.sortDirection = this.selectedSort.value.sortDirection;
    } else {
      delete this.filters.sortBy;
      delete this.filters.sortDirection;
    }
    this.onFilterChange();
  }

  clearFilters(): void {
    this.filters = {
      page: 0,
      limit: this.pageSize,
    };
    this.selectedSort = null;
    this.onFilterChange();
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
      this.router.navigate(['/projects/new']);
    } else {
      // Armazena a URL de destino antes de redirecionar para login
      this.authService.setRedirectUrl('/projects/new');
      this.router.navigate(['/login']);
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
