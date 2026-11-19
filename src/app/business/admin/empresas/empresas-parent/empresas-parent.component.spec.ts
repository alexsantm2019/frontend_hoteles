import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasParentComponent } from './empresas-parent.component';

describe('EmpresasParentComponent', () => {
  let component: EmpresasParentComponent;
  let fixture: ComponentFixture<EmpresasParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresasParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresasParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
