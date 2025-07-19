import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReferencesComponent } from './pages/references/references.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectEditorComponent } from './pages/project-editor/project-editor.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'references',
    component: ReferencesComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'projects/new',
    component: ProjectEditorComponent,
  },
  {
    path: 'projects/:id/edit',
    component: ProjectEditorComponent,
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent,
  },
];
