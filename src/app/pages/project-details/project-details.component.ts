import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectService } from '../../services/projectMock.service';
import { Project } from '../../interfaces/projectMock.interface';
import { ProjectDescriptionCardComponent } from '../../components/cards/project-description-card/project-description-card.component';
import { ProjectInfoSidebarComponent } from '../../components/sidebars/project-info-sidebar/project-info-sidebar.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    ProjectDescriptionCardComponent,
    ProjectInfoSidebarComponent
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit {
  project?: Project;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      if (projectId) {
        this.loadProject(projectId);
      }
    });
  }

  private loadProject(projectId: string): void {
    this.loading = true;
    this.error = false;

    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        if (project) {
          this.project = project;
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
