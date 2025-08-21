import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import type { ProjectTool } from '../../interfaces/project/tool.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectToolService extends BaseApiService<ProjectTool> {
  private readonly endpoint = '/v1/project/tool';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ProjectTool[]> {
    return this.get<ProjectTool[]>(this.endpoint);
  }

  getById(id: number): Observable<ProjectTool> {
    return this.get<ProjectTool>(`${this.endpoint}/${id}`);
  }
}
