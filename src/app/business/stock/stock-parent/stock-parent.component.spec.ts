import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockParentComponent } from './stock-parent.component';

describe('StockParentComponent', () => {
  let component: StockParentComponent;
  let fixture: ComponentFixture<StockParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
