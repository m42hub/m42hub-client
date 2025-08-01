import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { ProjectRole } from '../../interfaces/project/role.interface';
import { CreateProjectTopic, ProjectTopic } from '../../interfaces/project/topic.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectTopicService extends BaseApiService<ProjectTopic> {
  private readonly endpoint = '/v1/project/topic';

  constructor(http: HttpClient) {
    super(http);
  }

  getAllProjects(): Observable<ProjectTopic[]> {
    return this.get<ProjectTopic[]>(this.endpoint);
  }

  getProjectById(id: number): Observable<ProjectTopic> {
    return this.get<ProjectTopic>(`${this.endpoint}/${id}`);
  }

  createProject(status: CreateProjectTopic): Observable<ProjectTopic> {
    return this.post<ProjectRole>(this.endpoint, status);
  }
}
