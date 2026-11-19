import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasParentComponent } from './reservas-parent.component';

describe('ReservasParentComponent', () => {
  let component: ReservasParentComponent;
  let fixture: ComponentFixture<ReservasParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
