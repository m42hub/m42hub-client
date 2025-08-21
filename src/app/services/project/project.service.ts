import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectSearchParams,
} from '../../interfaces/project/project.interface';
import type { PaginatedResponse } from '../../interfaces/utils/utils.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseApiService<Project> {
  private readonly endpoint = '/v1/project';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<Project[]> {
    return this.get<Project[]>(this.endpoint);
  }

  search(params?: ProjectSearchParams): Observable<PaginatedResponse<Project>> {
    return this.get<PaginatedResponse<Project>>(`${this.endpoint}/search`, params);
  }

  getById(id: number): Observable<Project> {
    return this.get<Project>(`${this.endpoint}/${id}`);
  }

  create(project: CreateProjectRequest): Observable<Project> {
    return this.post<Project>(this.endpoint, project);
  }

  update(id: number, project: UpdateProjectRequest): Observable<Project> {
    return this.put<Project>(`${this.endpoint}/${id}`, project);
  }
}
