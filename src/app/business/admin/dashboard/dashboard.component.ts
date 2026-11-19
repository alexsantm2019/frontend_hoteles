import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../core/environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  empresas = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.cargarEmpresas();
  }

  cargarEmpresas() {
    this.http
      .get<any[]>(`${environment.apiUrl}/admin/empresas/`)
      .subscribe({
        next: (res) => {
          this.empresas.set(res);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
  }
}
