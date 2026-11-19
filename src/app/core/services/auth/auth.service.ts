import { Injectable, signal, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  tap,
  Observable,
  BehaviorSubject,
  catchError,
  of,
  switchMap,
  throwError,
} from "rxjs";
import { environment } from "../../environments/environment";
import {
  User,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from "../../models/auth.models";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/auth`;
  private authInitialized = false;
  private initPromise: Promise<void> | null = null;

  currentUser = signal<User | null>(null);
  private accessToken = signal<string | null>(null);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('currentUser');
      if (savedToken && savedUser) {
        this.accessToken.set(savedToken);
        const parsedUser = JSON.parse(savedUser);
        this.currentUser.set(parsedUser);
        this.currentUserSubject.next(parsedUser);
      }
    }
  }

  get token(): string | null {
    return this.accessToken();
  }

  get isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }

  getFullName(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    return (
      `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login/`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.accessToken.set(res.access);
          this.currentUser.set(res.user);
          this.currentUserSubject.next(res.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', res.access);
            localStorage.setItem('currentUser', JSON.stringify(res.user));
          }
        }),
      );
  }

  refresh(): Observable<RefreshResponse> {
    return this.http
      .post<RefreshResponse>(
        `${this.apiUrl}/refresh/`,
        {},
        { withCredentials: true },
      )
      .pipe(
        tap((res) => {
          this.accessToken.set(res.access);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', res.access);
          }
        }),
        catchError((err) => {
          this.clearSession(); // Limpia todo si el refresh falla
          return throwError(() => err);
        }),
      );
  }

  loadMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me/`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
    );
  }

  initializeAuth(): Observable<User | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }

    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      this.authInitialized = true;
      return of(null);
    }

    this.accessToken.set(savedToken);

    const request$ = this.loadMe().pipe(
      catchError(() => {
        console.warn('Token expirado, intentando refresh...');
        return this.refresh().pipe(
          switchMap(() => this.loadMe()),
          catchError((err) => {
            console.error('Sesión irrecuperable, cerrando sesión', err);
            this.clearSession();
            return of(null);
          }),
        );
      }),
      tap(() => {
        this.authInitialized = true;
      }),
    );

    return request$;
  }

  ensureAuthInitialized(): Promise<void> {
    console.log(
      '🟢 ensureAuthInitialized llamado. authInitialized =',
      this.authInitialized,
    );

    if (this.authInitialized) {
      console.log('🟢 Ya inicializado, resolviendo inmediatamente');
      return Promise.resolve();
    }

    if (this.initPromise) {
      console.log('🟢 Ya hay una promesa en curso, esperándola');
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve) => {
      const savedToken = isPlatformBrowser(this.platformId)
        ? localStorage.getItem('token')
        : null;
      console.log(
        '🟢 Token en localStorage:',
        savedToken
          ? 'SÍ (empieza con ' + savedToken.substring(0, 20) + '...)'
          : 'NO',
      );

      if (this.accessToken()) {
        console.log('🟢 Hay token en memoria, OK');
        this.authInitialized = true;
        resolve();
        return;
      }

      if (savedToken) {
        console.log('🟢 Seteando token desde localStorage...');
        this.accessToken.set(savedToken);
        this.loadMe().subscribe({
          next: (user) => {
            console.log('🟢 loadMe() exitoso:', user.username);
            this.authInitialized = true;
            resolve();
          },
          error: (err) => {
            console.log(
              '🟢 loadMe() FALLÓ con error:',
              err.status,
              '- Intentando refresh...',
            );
            this.tryRefreshAndResolve(resolve);
          },
        });
      } else {
        console.log('🟢 No hay token guardado. Intentando refresh directo...');
        this.tryRefreshAndResolve(resolve);
      }
    });

    return this.initPromise;
  }

  private tryRefreshAndResolve(resolve: () => void) {
    console.log('🟡 tryRefreshAndResolve: llamando a refresh()...');
    this.refresh().subscribe({
      next: () => {
        console.log('🟡 refresh() EXITOSO. Cargando usuario...');
        this.loadMe().subscribe({
          next: () => {
            console.log('🟡 loadMe() exitoso tras refresh');
            this.authInitialized = true;
            resolve();
          },
          error: (err) => {
            console.log('🟡 loadMe() falló tras refresh:', err.status);
            this.authInitialized = true;
            resolve();
          },
        });
      },
      error: (err) => {
        console.log('🟡 refresh() FALLÓ con error:', err.status, err.error);
        this.clearSession();
        this.authInitialized = true;
        resolve();
      },
    });
  }

  logout(): Observable<{ detail: string }> {
    return this.http
      .post<{
        detail: string;
      }>(`${this.apiUrl}/logout/`, {}, { withCredentials: true })
      .pipe(tap(() => this.clearSession()));
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }
}
