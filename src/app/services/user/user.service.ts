import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user/user.interface';
import { BaseApiService } from '../base/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService<User> {
  private readonly endpoint = '/v1/user';

  constructor(http: HttpClient) {
    super(http);
  }

  getProjectById(id: number): Observable<User> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }
}
