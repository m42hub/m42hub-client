import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import type { ProjectStatus } from '../../interfaces/project/status.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectStatusService extends BaseApiService<ProjectStatus> {
  private readonly endpoint = '/v1/project/status';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ProjectStatus[]> {
    return this.get<ProjectStatus[]>(this.endpoint);
  }

  getById(id: number): Observable<ProjectStatus> {
    return this.get<ProjectStatus>(`${this.endpoint}/${id}`);
  }
}
