import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type {
  AuthenticatedUser,
  User,
  UserInfoRequest,
  UserPasswordChangeRequest,
} from '../../interfaces/user/user.interface';
import { BaseApiService } from '../base/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService<User> {
  private readonly endpoint = '/v1/user';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  getUserById(id: number): Observable<User> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  getUserByUsername(id: number): Observable<User> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  editInfo(username: string, userInfo: UserInfoRequest): Observable<AuthenticatedUser> {
    return this.patch<AuthenticatedUser>(`${this.endpoint}/info/${username}`, userInfo);
  }

  changeProfilePic(username: string, profilePicUrl: string): Observable<AuthenticatedUser> {
    return this.patch<AuthenticatedUser>(`${this.endpoint}/profile-pic/${username}`, {
      profilePicUrl,
    });
  }

  changePassword(
    username: string,
    passwordChangeRequest: UserPasswordChangeRequest,
  ): Observable<AuthenticatedUser> {
    return this.patch<AuthenticatedUser>(
      `${this.endpoint}/password/${username}`,
      passwordChangeRequest,
    );
  }

  deactivateUser(username: string): Observable<User> {
    return this.patch<User>(`${this.endpoint}/deactivate/${username}`, '');
  }
}
