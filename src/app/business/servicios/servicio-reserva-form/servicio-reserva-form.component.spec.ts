import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioReservaFormComponent } from './servicio-reserva-form.component';

describe('ServicioReservaFormComponent', () => {
  let component: ServicioReservaFormComponent;
  let fixture: ComponentFixture<ServicioReservaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioReservaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioReservaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
