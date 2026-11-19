import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporadasParentComponent } from './temporadas-parent.component';

describe('TemporadasParentComponent', () => {
  let component: TemporadasParentComponent;
  let fixture: ComponentFixture<TemporadasParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporadasParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporadasParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
