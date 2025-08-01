import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { ProjectComplexity } from '../../interfaces/project/complexity.interface';
import { CreateProjectTool, ProjectTool } from '../../interfaces/project/tool.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectToolService extends BaseApiService<ProjectTool> {
  private readonly endpoint = '/v1/project/tool';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllProjects(): Observable<ProjectTool[]> {
    return this.get<ProjectComplexity[]>(this.endpoint);
  }

  getProjectById(id: number): Observable<ProjectTool> {
    return this.get<ProjectComplexity>(`${this.endpoint}/${id}`);
  }

  createProject(tool: CreateProjectTool): Observable<ProjectComplexity> {
    return this.post<ProjectComplexity>(this.endpoint, tool);
  }
}
