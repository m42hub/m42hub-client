import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import type { ProjectRole } from '../../interfaces/project/role.interface';
import { CreateProjectRole } from '../../interfaces/project/role.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectRoleService extends BaseApiService<ProjectRole> {
  private readonly endpoint = '/v1/project/role';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ProjectRole[]> {
    return this.get<ProjectRole[]>(this.endpoint);
  }

  getById(id: number): Observable<ProjectRole> {
    return this.get<ProjectRole>(`${this.endpoint}/${id}`);
  }
}
