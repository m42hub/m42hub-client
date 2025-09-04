import type { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectEditorComponent } from './pages/project-editor/project-editor.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { authGuard } from './guards/auth.guard';

import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserProjectsComponent } from './pages/user-projects/user-projects.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'user/:username',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'projects/user/:username',
    component: UserProjectsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'projects/new',
    component: ProjectEditorComponent,
    canActivate: [authGuard],
  },
  {
    path: 'projects/:id/edit',
    component: ProjectEditorComponent,
    canActivate: [authGuard],
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
