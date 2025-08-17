import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, RegisterRequest } from '../../interfaces/user/user.interface';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  protected readonly apiUrl = ENVIRONMENT.apiUrl;
  private userSubject = new BehaviorSubject<User| null>(null);
  user$ = this.userSubject.asObservable();
  private _isInitialized = false;
  private redirectUrl: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>(
        `${this.apiUrl}/v1/auth/login`,
        { username, password }
      )
      .pipe(tap(response => this.userSubject.next(response.user)));
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.http
      .post<User>(
        `${this.apiUrl}/v1/auth/register`,
        registerData
      );
  }

  loadUser(): Observable<User | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }

    return this.http
      .get<User>(`${this.apiUrl}/v1/user/me`)
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
          this._isInitialized = true;
        }),
        catchError(() => {
          this.userSubject.next(null);
          this._isInitialized = true;
          return of(null);
        })
      );
  }

  initializeAuth(): Observable<User | null> {
    if (!isPlatformBrowser(this.platformId) || this._isInitialized) {
      return of(this.userSubject.value);
    }

    return this.loadUser();
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/v1/auth/logout`, {})
      .pipe(tap(() => this.userSubject.next(null)));
  }

  get isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }
}
