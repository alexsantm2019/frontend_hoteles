import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosParentComponent } from './servicios-parent.component';

describe('ServiciosParentComponent', () => {
  let component: ServiciosParentComponent;
  let fixture: ComponentFixture<ServiciosParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
