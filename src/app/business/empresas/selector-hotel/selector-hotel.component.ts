import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmpresaService } from '../../../core/services/empresa/empresa.service';
import { MaterialModule } from '../../../material.module';
import { Hotel } from '../../../core/models/empresa.models';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-selector-hotel',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './selector-hotel.component.html',
  styleUrls: ['./selector-hotel.component.scss'],
})
export class SelectorHotelComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private router = inject(Router);

  hoteles = this.empresaService.hotelesDisponibles;
  hotelActivo = this.empresaService.hotelActivo;
  cargando = signal(true);

  ngOnInit() {
    this.empresaService.cargarMisHoteles().subscribe({
      next: () => this.cargando.set(false),
      error: () => this.cargando.set(false),
    });
  }

  seleccionarHotel(hotel: Hotel) {
    this.empresaService.seleccionarHotel(hotel);
  }

  confirmarSeleccion() {
    if (this.hotelActivo()) {
      this.router.navigate(['/business/dashboard']); // O al dashboard
    }
  }
}
