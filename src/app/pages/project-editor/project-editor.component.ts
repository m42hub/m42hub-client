import type { OnInit } from '@angular/core';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProjectFormComponent } from '../../components/forms/project-form/project-form.component';
import { DisclaimerModalComponent } from '../../components/modals/disclaimer-modal/disclaimer-modal.component';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../../interfaces/project/project.interface';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-project-editor',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    DisclaimerModalComponent,
    ProjectFormComponent,
  ],
  providers: [MessageService],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.css',
})
export class ProjectEditorComponent implements OnInit {
  project?: Project;
  projectNotFound = false;
  isEditMode = false;
  isBrowser = false;
  projectLoaded = false;
  showDisclaimerModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private checkEditMode(): void {
    let projectId = this.route.snapshot.paramMap.get('id');
    if (!projectId) {
      projectId = this.route.snapshot.queryParamMap.get('id');
    }
    const url = this.router.url;

    if (url.includes('/new')) {
      this.isEditMode = false;
      this.project = undefined;
      this.projectLoaded = true;
      this.showDisclaimerModal = true;
    } else if (url.includes('/edit') && projectId) {
      this.isEditMode = true;
      this.loadProject(projectId);
    } else {
      void this.router.navigate(['/projects']);
    }
  }

  private loadProject(projectId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.projectLoaded = true;
      return;
    }

    this.projectLoaded = false;
    this.projectService.getById(Number(projectId)).subscribe({
      next: (project) => {
        this.project = project;
        this.projectLoaded = true;
      },
      error: (_error) => {
        this.projectNotFound = true;
      },
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
    this.projectService.create(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto criado com sucesso!',
        });
        void this.router.navigate(['/projects']);
      },
      error: (error) => {
        console.error('Erro ao criar projeto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar o projeto',
        });
      },
    });
  }

  private updateProject(id: number, request: UpdateProjectRequest): void {
    this.projectService.update(id, request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto atualizado com sucesso!',
        });
        void this.router.navigate(['/projects']);
      },
      error: (error) => {
        console.error('Erro ao atualizar projeto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível atualizar o projeto',
        });
      },
    });
  }

  onCancel(): void {
    void this.router.navigate(['/projects']);
  }

  goBack(): void {
    void this.router.navigate(['/projects']);
  }

  onDisclaimerAccepted(): void {
    this.showDisclaimerModal = false;
  }

  onDisclaimerCancelled(): void {
    void this.router.navigate(['/projects']);
  }
}
