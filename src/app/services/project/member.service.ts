import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { ApplyProjectMember, ProjectMember } from '../../interfaces/project/member.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService extends BaseApiService<ProjectMember> {
  private readonly endpoint = '/v1/project/member';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(): Observable<ProjectMember[]> {
    return this.get<ProjectMember[]>(this.endpoint);
  }

  getById(id: number): Observable<ProjectMember> {
    return this.get<ProjectMember>(`${this.endpoint}/${id}`);
  }

  apply(member: ApplyProjectMember): Observable<ProjectMember> {
    return this.post<ProjectMember>(`${this.endpoint}/apply`, member);
  }

  approve(id: number): Observable<ProjectMember> {
    return this.patch<ProjectMember>(`${this.endpoint}/approve/${id}`, '');
  }

  reject(id: number, applicationFeedback: string): Observable<ProjectMember> {
    return this.patch<ProjectMember>(`${this.endpoint}/reject/${id}`, {applicationFeedback});
  }
}
