import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { CreateProjectStatus, ProjectStatus } from '../../interfaces/project/status.interface';
import { CreateProjectComplexity, ProjectComplexity } from '../../interfaces/project/complexity.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectComplexityService extends BaseApiService<ProjectComplexity> {
  private readonly endpoint = '/v1/project/complexity';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ProjectComplexity[]> {
    return this.get<ProjectComplexity[]>(this.endpoint);
  }

  getById(id: number): Observable<ProjectComplexity> {
    return this.get<ProjectComplexity>(`${this.endpoint}/${id}`);
  }
}
