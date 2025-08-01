import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProjectsComponent as ProjectCardComponent } from '../../components/cards/projects/projects.component';
import { ProjectSummaryCardComponent } from '../../components/cards/project-summary-card/project-summary-card.component';
import { Project } from '../../interfaces/project/project.interface';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProjectSummaryCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  pageSize = 3;
  currentPage = 1;
  totalPages = 1;
  totalElements = 0;

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.searchProjects({
      page: this.currentPage - 1,
      limit: this.pageSize
    }).subscribe((res) => {
      this.projects = res.content;
      this.totalPages = res.pagination.totalPages;
      this.totalElements = res.pagination.totalElements;
    });
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
    this.router.navigate(['/projects/new']);
  }
}
