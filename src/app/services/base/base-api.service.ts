import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ENVIRONMENT } from "../../../environments/environment";
import { catchError, Observable, throwError } from "rxjs";
import { options } from "marked";

export abstract class BaseApiService<T> {
  protected readonly apiUrl = ENVIRONMENT.apiUrl;

  constructor(protected http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private buildQueryString(params: Record<string, any>): string {
    const filteredEntries = Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null
    );

    const query = filteredEntries
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${encodeURIComponent(key)}=${value
            .map((v) => encodeURIComponent(v))
            .join(',')}`;
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    return query ? `${query}` : '';
  }

  protected get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Observable<T> {
    const headers = this.getHeaders();
    if (params) {
      const queryString = this.buildQueryString(params);
      return this.http
        .get<T>(`${this.apiUrl}${endpoint}${endpoint}${queryString}`, {
          headers,
        })
        .pipe(catchError(this.handleError));
    }
    return this.http
      .get<T>(`${this.apiUrl}${endpoint}`, { headers })
      .pipe(catchError(this.handleError));
  }

  protected post<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http
      .post<T>(`${this.apiUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected patch<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http
      .put<T>(`${this.apiUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  protected delete<T>(endpoint: string, options?: Object): Observable<T> {
    const headers = this.getHeaders();
    return this.http
      .put<T>(`${this.apiUrl}${endpoint}`, { headers, ...options })
      .pipe(catchError(this.handleError));
  }

  protected handleError(error: any): Observable<never> {
    console.error('API Error: ', error);
    return throwError(() => error);
  }
}
