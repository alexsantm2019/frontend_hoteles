import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroHabitacionesComponent } from './tablero-habitaciones.component';

describe('TableroHabitacionesComponent', () => {
  let component: TableroHabitacionesComponent;
  let fixture: ComponentFixture<TableroHabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableroHabitacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableroHabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
