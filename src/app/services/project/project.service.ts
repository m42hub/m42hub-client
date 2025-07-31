import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectSearchParams,
} from '../../interfaces/project/project.interface';
import { PaginatedResponse } from '../../interfaces/utils/utils.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService<Project> {
  private readonly endpoint = '/v1/project';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllProjects(): Observable<Project[]> {
    return this.get<Project[]>(this.endpoint);
  }

  searchProjects(params?: ProjectSearchParams): Observable<PaginatedResponse<Project>> {
    return this.get<PaginatedResponse<Project>>(`${this.endpoint}/search`, params);
  }

  getProjectById(id: number): Observable<Project> {
    return this.get<Project>(`${this.endpoint}/${id}`);
  }

  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.post<Project>(this.endpoint, project);
  }

  updateProject(id: number, project: UpdateProjectRequest): Observable<Project> {
    return this.patch<Project>(`${this.endpoint}/${id}`, project);
  }
}
