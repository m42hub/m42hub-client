import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { ProjectComplexity } from '../../interfaces/project/complexity.interface';
import { CreateProjectTool, ProjectTool } from '../../interfaces/project/tool.interface';
import { CreateProjectMember, ProjectMemberSimplified } from '../../interfaces/project/member.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService extends BaseApiService<ProjectMemberSimplified> {
  private readonly endpoint = '/api/v1/tool';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllProjects(): Observable<ProjectMemberSimplified[]> {
    return this.get<ProjectMemberSimplified[]>(this.endpoint);
  }

  getProjectById(id: number): Observable<ProjectMemberSimplified> {
    return this.get<ProjectMemberSimplified>(`${this.endpoint}/${id}`);
  }

  createProject(member: CreateProjectMember): Observable<ProjectMemberSimplified> {
    return this.post<ProjectMemberSimplified>(this.endpoint, member);
  }
}
