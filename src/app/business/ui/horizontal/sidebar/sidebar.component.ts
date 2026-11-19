import { Component, OnInit, inject, signal, effect, ChangeDetectorRef } from '@angular/core';
import { navItems } from './sidebar-data';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppHorizontalNavItemComponent } from './nav-item/nav-item.component';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NavItem } from 'src/app/core/models/NavItem.models';

@Component({
  selector: 'app-horizontal-sidebar',
  standalone: true,
  imports: [AppHorizontalNavItemComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class AppHorizontalSidebarComponent implements OnInit {
  navItems = navItems;
  parentActive = '';
    firstRowItems: any[] = []; // variable para filtro
    secondRowItems: any[] = []; // variable para filtro

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  private authService = inject(AuthService);

  // ⭐ Signal para el rol del usuario
  userRole = signal<'superadmin' | 'admin_empresa' | 'usuario'>('usuario');

  constructor(
    public navService: NavService,
    public router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.subscribe(
      () => (this.parentActive = this.router.url.split('/')[1]),
    );
    this.updateItemsByType();
  }

  ngOnInit(): void {
    this.getUserRole();
  }

  private getUserRole(): void {
    // ⭐ Obtener el rol usando los flags
    // if (this.authService.isSuperAdmin()) {
    //   this.userRole.set('superadmin');
    // } else if (this.authService.isAdminEmpresa()) {
    //   this.userRole.set('admin_empresa');
    // } else {
    //   this.userRole.set('usuario');
    // }

    // console.log('👑 Rol del usuario:', this.userRole());
    // console.log('📌 is_superuser:', this.authService.isSuperAdmin());
    // console.log('📌 es_admin_empresa:', this.authService.isAdminEmpresa());
  }

  // ⭐ Verificar si un item es visible según el permiso
  isItemVisible(item: NavItem): boolean {
    const role = this.userRole();

    // Si no tiene permiso definido, visible para todos
    if (!item.permission) return true;

    // Superadmin ve todo
    if (role === 'superadmin') return true;

    // Admin empresa ve items con permiso 'admin_empresa' o 'usuario'
    if (role === 'admin_empresa') {
      return (
        item.permission === 'admin_empresa' || item.permission === 'usuario'
      );
    }

    // Usuario solo ve items con permiso 'usuario'
    return item.permission === 'usuario';
  }

  // ⭐ Filtrar los items
  get filteredFirstRowItems(): NavItem[] {
    return this.firstRowItems.filter((item) => this.isItemVisible(item));
  }

  get filteredSecondRowItems(): NavItem[] {
    return this.secondRowItems.filter((item) => this.isItemVisible(item));
  }

  private updateItemsByType(): void {
    this.firstRowItems = this.navItems.filter((item) => item.ddType === '1');
    this.secondRowItems = this.navItems.filter((item) => item.ddType !== '1');
  }
}