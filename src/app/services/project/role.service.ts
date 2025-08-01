import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { CreateProjectRole, ProjectRole } from '../../interfaces/project/role.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectRoleService extends BaseApiService<ProjectRole> {
  private readonly endpoint = '/v1/project/role';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllProjects(): Observable<ProjectRole[]> {
    return this.get<ProjectRole[]>(this.endpoint);
  }

  getProjectById(id: number): Observable<ProjectRole> {
    return this.get<ProjectRole>(`${this.endpoint}/${id}`);
  }

  createProject(role: CreateProjectRole): Observable<ProjectRole> {
    return this.post<ProjectRole>(this.endpoint, role);
  }
}
