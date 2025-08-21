import type { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ENVIRONMENT } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import { catchError, throwError, of } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export abstract class BaseApiService<_T> {
  protected readonly apiUrl = ENVIRONMENT.apiUrl;

  constructor(
    protected http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private buildQueryString(params: Record<string, any>): string {
    const filteredEntries = Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null,
    );

    const query = filteredEntries
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${encodeURIComponent(key)}=${value.map((v) => encodeURIComponent(v)).join(',')}`;
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    return query ? `${query}` : '';
  }

  protected get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    // Durante SSR, retornar observable vazio para evitar requisições
    if (!isPlatformBrowser(this.platformId) || !this.apiUrl) {
      return of([] as unknown as T);
    }

    const headers = this.getHeaders();
    if (params) {
      const queryString = this.buildQueryString(params);
      return this.http
        .get<T>(`${this.apiUrl}${endpoint}?${queryString}`, {
          headers,
        })
        .pipe(catchError(this.handleError));
    }
    return this.http
      .get<T>(`${this.apiUrl}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  protected post<T>(endpoint: string, body: any): Observable<T> {
    if (!isPlatformBrowser(this.platformId) || !this.apiUrl) {
      return of({} as T);
    }

    const headers = this.getHeaders();
    return this.http
      .post<T>(`${this.apiUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected put<T>(endpoint: string, body: any): Observable<T> {
    if (!isPlatformBrowser(this.platformId) || !this.apiUrl) {
      return of({} as T);
    }

    const headers = this.getHeaders();
    return this.http
      .put<T>(`${this.apiUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected patch<T>(endpoint: string, body: any): Observable<T> {
    if (!isPlatformBrowser(this.platformId) || !this.apiUrl) {
      return of({} as T);
    }

    const headers = this.getHeaders();
    return this.http
      .patch<T>(`${this.apiUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected delete<T>(endpoint: string, options?: Object): Observable<T> {
    if (!isPlatformBrowser(this.platformId) || !this.apiUrl) {
      return of({} as T);
    }

    const headers = this.getHeaders();
    return this.http
      .delete<T>(`${this.apiUrl}${endpoint}`, { headers, ...options })
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
