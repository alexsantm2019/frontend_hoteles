import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EmpresaService } from '../../core/services/empresa/empresa.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    NgApexchartsModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private http = inject(HttpClient);

  hotelActivo = this.empresaService.hotelActivo;
  cargando = signal(true);
  kpis = signal<any>(null);

  // Configuraciones de los Gráficos
  chartIngresos: any;
  chartDonut: any;
  chartHousekeeping: any;
  chartProyeccion: any;
  topHabitaciones: any[] = [];
  topMinibar: any[] = [];

  ngOnInit() {
    const hotel = this.hotelActivo();
    if (hotel) {
      this.http
        .get(`${environment.apiUrl}/reservas/dashboard/?hotel_id=${hotel.id}`)
        .subscribe({
          next: (res: any) => {
            this.kpis.set(res.kpis);
            this.topHabitaciones = res.graficos.top_habitaciones;
            this.topMinibar = res.graficos.top_minibar;

            this.buildCharts(res.graficos);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false),
        });
    }
  }

  buildCharts(data: any) {
    // 1. Ingresos 7 Días
    this.chartIngresos = {
      series: [
        {
          name: 'Ingresos',
          data: data.ingresos_7_dias.map((d: any) => d.total),
        },
      ],
      chart: { type: 'area', height: 280, toolbar: { show: false } },
      colors: ['#f26d4f'],
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: data.ingresos_7_dias.map((d: any) => d.dia),
        axisBorder: { show: false },
      },
      dataLabels: { enabled: false },
    };

    // 2. Donut Distribución
    this.chartDonut = {
      series: [
        data.distribucion.habitaciones,
        data.distribucion.servicios,
        data.distribucion.minibar,
      ],
      chart: { type: 'donut', height: 280 },
      labels: ['Habitaciones', 'Servicios', 'Minibar'],
      colors: ['#f26d4f', '#17a2b8', '#ffc107'],
      legend: { position: 'bottom' },
    };

    // 3. Housekeeping (Barras)
    const hk = data.housekeeping;
    this.chartHousekeeping = {
      series: [
        {
          name: 'Habitaciones',
          data: [hk['1'] || 0, hk['2'] || 0, hk['3'] || 0, hk['4'] || 0],
        },
      ],
      chart: { type: 'bar', height: 250, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
      colors: ['#28a745', '#ffc107', '#17a2b8', '#dc3545'],
      xaxis: { categories: ['Limpias', 'Sucias', 'En Limpieza', 'Mantenim.'] },
      dataLabels: { enabled: false },
    };

    // 4. Proyección 7 días
    this.chartProyeccion = {
      series: [
        {
          name: 'Hab. Ocupadas',
          data: data.proyeccion.map((p: any) => p.ocupadas),
        },
      ],
      chart: { type: 'bar', height: 250, toolbar: { show: false } },
      colors: ['#f26d4f'],
      plotOptions: { bar: { borderRadius: 4 } },
      xaxis: { categories: data.proyeccion.map((p: any) => p.fecha) },
      dataLabels: { enabled: true },
    };
  }
}
