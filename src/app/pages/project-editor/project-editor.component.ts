import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProjectFormComponent } from '../../components/forms/project-form/project-form.component';
import { Project } from '../../interfaces/project.interface';
import { ProjectService } from '../../services/project.service';

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
    const projectId = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    // Se a URL contém '/new', é modo de criação
    if (url.includes('/new')) {
      this.isEditMode = false;
      this.project = undefined;
    }
    // Se a URL contém '/edit' e tem ID, é modo de edição
    else if (url.includes('/edit') && projectId) {
      this.isEditMode = true;
      this.loadProject(projectId);
    }
    // Se chegou aqui, algo deu errado - redireciona para criação
    else {
      this.router.navigate(['/projects/new']);
    }
  }

  private loadProject(projectId: string): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        if (project) {
          this.project = project;
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

  onSave(project: Project): void {
    if (this.isEditMode) {
      this.updateProject(project);
    } else {
      this.createProject(project);
    }
  }

  private createProject(project: Project): void {
    this.projectService.createProject(project).subscribe({
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

  private updateProject(project: Project): void {
    this.projectService.updateProject(project).subscribe({
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
}
