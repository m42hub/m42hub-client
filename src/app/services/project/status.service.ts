import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { CreateProjectStatus, ProjectStatus } from '../../interfaces/project/status.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService extends BaseApiService<ProjectStatus> {
  private readonly endpoint = '/v1/status';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllProjects(): Observable<ProjectStatus[]> {
    return this.get<ProjectStatus[]>(this.endpoint);
  }

  getProjectById(id: number): Observable<ProjectStatus> {
    return this.get<ProjectStatus>(`${this.endpoint}/${id}`);
  }

  createProject(status: CreateProjectStatus): Observable<ProjectStatus> {
    return this.post<ProjectStatus>(this.endpoint, status);
  }
}
