import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { User } from '../../interfaces/user/user.interface';
import { BaseApiService } from '../base/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService<User> {
  private readonly endpoint = '/v1/user';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getProjectById(id: number): Observable<User> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }
}
