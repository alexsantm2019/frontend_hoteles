import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelesEmpresaComponent } from './hoteles-empresa.component';

describe('HotelesEmpresaComponent', () => {
  let component: HotelesEmpresaComponent;
  let fixture: ComponentFixture<HotelesEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelesEmpresaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelesEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
