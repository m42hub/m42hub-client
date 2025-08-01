import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProjectFormComponent } from '../../components/forms/project-form/project-form.component';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../interfaces/project/project.interface';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-project-editor',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ProjectFormComponent
  ],
  providers: [MessageService],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.css'
})
export class ProjectEditorComponent implements OnInit {
  project?: Project;
  isEditMode = false;
  isBrowser = false;
  projectLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private checkEditMode(): void {
    // Permite buscar o id tanto por param quanto por query
    let projectId = this.route.snapshot.paramMap.get('id');
    if (!projectId) {
      projectId = this.route.snapshot.queryParamMap.get('id');
    }
    const url = this.router.url;

    if (url.includes('/new')) {
      this.isEditMode = false;
      this.project = undefined;
      this.projectLoaded = true;
    } else if ((url.includes('/edit') || !!projectId) && projectId) {
      this.isEditMode = true;
      this.loadProject(projectId);
    } else {
      this.router.navigate(['/projects/new']);
    }
  }

  private loadProject(projectId: string): void {
    this.projectLoaded = false;
    this.projectService.getProjectById(Number(projectId)).subscribe({
      next: (project) => {
        if (project) {
          this.project = project;
          this.projectLoaded = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Projeto não encontrado'
          });
          this.router.navigate(['/projects']);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar projeto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar o projeto'
        });
        this.router.navigate(['/projects']);
      }
    });
  }


  onSave(request: CreateProjectRequest | UpdateProjectRequest): void {
    if (this.isEditMode && this.project) {
      this.updateProject(this.project.id, request as UpdateProjectRequest);
    } else {
      this.createProject(request as CreateProjectRequest);
    }
  }


  private createProject(request: CreateProjectRequest): void {
    this.projectService.createProject(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto criado com sucesso!'
        });
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        console.error('Erro ao criar projeto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar o projeto'
        });
      }
    });
  }


  private updateProject(id: number, request: UpdateProjectRequest): void {
    this.projectService.updateProject(id, request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto atualizado com sucesso!'
        });
        this.router.navigate(['/projects']);
      },
      error: (error) => {
        console.error('Erro ao atualizar projeto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível atualizar o projeto'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/projects']);
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
