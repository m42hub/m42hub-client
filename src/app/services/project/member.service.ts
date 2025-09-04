import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import type { ApplyProjectMember, ProjectMember, ProjectMemberProject } from '../../interfaces/project/member.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService extends BaseApiService<ProjectMember> {
  private readonly endpoint = '/v1/project/member';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getAll(): Observable<ProjectMember[]> {
    return this.get<ProjectMember[]>(this.endpoint);
  }

  getById(id: number): Observable<ProjectMember> {
    return this.get<ProjectMember>(`${this.endpoint}/${id}`);
  }

  getByUsername(username: string): Observable<ProjectMemberProject[]> {
    return this.get<ProjectMemberProject[]>(`${this.endpoint}/user/${username}`);
  }

  apply(member: ApplyProjectMember): Observable<ProjectMember> {
    return this.post<ProjectMember>(`${this.endpoint}/apply`, member);
  }

  approve(id: number): Observable<ProjectMember> {
    return this.patch<ProjectMember>(`${this.endpoint}/approve/${id}`, '');
  }

  reject(id: number, applicationFeedback: string): Observable<ProjectMember> {
    return this.patch<ProjectMember>(`${this.endpoint}/reject/${id}`, { applicationFeedback });
  }
}
