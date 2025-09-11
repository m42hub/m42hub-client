import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import type { Observable } from 'rxjs';
import { BaseApiService } from '../base/base-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImageService extends BaseApiService<String> {
  private readonly endpoint = '/v1/image';

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  changeBannerPic(file: File): Observable<String> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.patch<String>(`${this.apiUrl}${this.endpoint}/upload`, formData);
  }
}
