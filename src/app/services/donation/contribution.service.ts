import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import { DonationSearchParams } from '../../interfaces/donation/donation.interface';
import { UserInfo } from '../../interfaces/user/user.interface';

@Injectable({
  providedIn: 'root',
})
export class DonationService extends BaseApiService<UserInfo> {
  private readonly endpoint = '/v1/donation';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  donationRanking(params?: DonationSearchParams): Observable<UserInfo[]> {
    return this.get<UserInfo[]>(`${this.endpoint}/ranking`, params);
  }
}
