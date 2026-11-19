import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
// import {
//   AuthInterface,
//   UserDataInterface,
//   // Rol,
// } from '../../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class PruebaService {
  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/test/`;

  // // ⭐ Signals para el rol
  // public userRole = signal<'superadmin' | 'admin_empresa' | 'usuario'>(
  //   'usuario',
  // );
  
  // private tokenSubject: BehaviorSubject<string | null>;
  // public token: Observable<string | null>;

  // constructor(
  //   private http: HttpClient,
  //   private router: Router,
  // ) {
  //   this.tokenSubject = new BehaviorSubject<string | null>(
  //     localStorage.getItem('token'),
  //   );
  //   this.token = this.tokenSubject.asObservable();
  // }

  // getTest(): Observable<any[]> {
  //   return this.http.get<any[]>(
  //     `${this.apiUrl}`,
  //   );
  // }


}
