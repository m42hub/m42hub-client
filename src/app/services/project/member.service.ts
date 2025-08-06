import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { CreateProjectRole, ProjectRole } from '../../interfaces/project/role.interface';
import { ProjectMember } from '../../interfaces/project/member.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService extends BaseApiService<ProjectMember> {
  private readonly endpoint = '/v1/project/member';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllProjects(): Observable<ProjectMember[]> {
    return this.get<ProjectMember[]>(this.endpoint);
  }

  getProjectById(id: number): Observable<ProjectMember> {
    return this.get<ProjectMember>(`${this.endpoint}/${id}`);
  }

  approveMember(id: number): Observable<ProjectMember> {
    return this.patch<ProjectMember>(`${this.endpoint}/approve/${id}`, '');
  }

  rejectMember(id: number, applicationFeedback: string): Observable<ProjectMember> {
    return this.patch<ProjectMember>(`${this.endpoint}/reject/${id}`, {applicationFeedback});
  }
}
