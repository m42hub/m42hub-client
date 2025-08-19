import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProjectService } from '../../services/project/project.service';
import { Project } from '../../interfaces/project/project.interface';
import { ProjectDescriptionCardComponent } from '../../components/cards/project-description-card/project-description-card.component';
import { ProjectInfoSidebarComponent } from '../../components/sidebars/project-info-sidebar/project-info-sidebar.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
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
    const id = parseInt(projectId);
    if (isNaN(id)) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.projectService.getById(id).subscribe({
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
