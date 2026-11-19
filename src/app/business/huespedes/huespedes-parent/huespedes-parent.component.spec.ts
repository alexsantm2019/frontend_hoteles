import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuespedesParentComponent } from './huespedes-parent.component';

describe('HuespedesParentComponent', () => {
  let component: HuespedesParentComponent;
  let fixture: ComponentFixture<HuespedesParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuespedesParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HuespedesParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
