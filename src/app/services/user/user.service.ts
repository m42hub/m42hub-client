import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type {
  User,
  UserInfo,
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

  getUserByUsername(username: string): Observable<UserInfo> {
    return this.get<UserInfo>(`${this.endpoint}/${username}`);
  }

  editInfo(username: string, userInfo: UserInfoRequest): Observable<UserInfo> {
    return this.patch<UserInfo>(`${this.endpoint}/info/${username}`, userInfo);
  }

  changeProfilePic(username: string, file: File): Observable<UserInfo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.patch<UserInfo>(
      `${this.apiUrl}${this.endpoint}/profile-pic/${username}`,
      formData,
    );
  }

  changeBannerPic(username: string, file: File): Observable<UserInfo> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.patch<UserInfo>(
      `${this.apiUrl}${this.endpoint}/profile-banner/${username}`,
      formData,
    );
  }

  changePassword(
    username: string,
    passwordChangeRequest: UserPasswordChangeRequest,
  ): Observable<UserInfo> {
    return this.patch<UserInfo>(`${this.endpoint}/password/${username}`, passwordChangeRequest);
  }

  deactivateUser(username: string): Observable<User> {
    return this.patch<User>(`${this.endpoint}/deactivate/${username}`, '');
  }
}
