import { Component, EventEmitter, Output, Inject, PLATFORM_ID, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProjectComplexityService } from '../../../services/project/complexity.service';
import { ProjectStatusService } from '../../../services/project/status.service';
import { ProjectToolService } from '../../../services/project/tool.service';
import { ProjectTopicService } from '../../../services/project/topic.service';
import { ProjectRoleService } from '../../../services/project/role.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-project-filter',
  standalone: true,
  templateUrl: './project-filter.component.html',
  styleUrl: './project-filter.component.css',
  imports: [FormsModule, SelectModule, MultiSelectModule],
})
export class ProjectFilterComponent implements OnInit {
  sortOptions: any[] = [
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
  filters: any = {};

  @Output() filtersChange = new EventEmitter<any>();
  @Output() closeFilters = new EventEmitter<void>();
  @Output() preEventLoadingSearch = new EventEmitter<void>();

  complexities: any[] = [];
  statuses: any[] = [];
  tools: any[] = [];
  topics: any[] = [];
  roles: any[] = [];

  private timeSearch: any = null;

  constructor(
    private complexityService: ProjectComplexityService,
    private statusService: ProjectStatusService,
    private toolService: ProjectToolService,
    private topicService: ProjectTopicService,
    private roleService: ProjectRoleService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFilterData();
    }
  }

  loadFilterData(): void {
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

  onSortChange() {
    if (this.selectedSort && this.selectedSort.value) {
      this.filters.sortBy = this.selectedSort.value.sortBy;
      this.filters.sortDirection = this.selectedSort.value.sortDirection;
    } else {
      delete this.filters.sortBy;
      delete this.filters.sortDirection;
    }
    this.emitFilters();
  }

  onFilterChange(): void {
    this.preEventLoadingSearch.emit();

    if (this.timeSearch != null) {
      clearTimeout(this.timeSearch);
    }

    this.timeSearch = setTimeout(() => {
      this.emitFilters()
      this.timeSearch = null
    }, 3000);
  }

  onClearFilters() {
    this.selectedSort = null;
    this.filters = {};
    this.emitFilters();
  }

  onCloseFilters() {
    this.closeFilters.emit();
  }

  emitFilters() {
    this.filtersChange.emit({ ...this.filters });
  }
}
