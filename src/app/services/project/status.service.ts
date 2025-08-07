import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { CreateProjectStatus, ProjectStatus } from '../../interfaces/project/status.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectStatusService extends BaseApiService<ProjectStatus> {
  private readonly endpoint = '/v1/project/status';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ProjectStatus[]> {
    return this.get<ProjectStatus[]>(this.endpoint);
  }

  getById(id: number): Observable<ProjectStatus> {
    return this.get<ProjectStatus>(`${this.endpoint}/${id}`);
  }
}
