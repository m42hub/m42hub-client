import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';
import {
  ContributionsByUser,
  ContributionSearchParams,
} from '../../interfaces/contribution/contribution.interface';

@Injectable({
  providedIn: 'root',
})
export class ContributionService extends BaseApiService<ContributionsByUser> {
  private readonly endpoint = '/v1/contribution';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  findByParamsGroupedByUser(params?: ContributionSearchParams): Observable<ContributionsByUser[]> {
    return this.get<ContributionsByUser[]>(`${this.endpoint}/users/search`, params);
  }
}
