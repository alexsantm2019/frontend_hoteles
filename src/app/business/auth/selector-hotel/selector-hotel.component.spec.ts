import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorHotelComponent } from './selector-hotel.component';

describe('SelectorHotelComponent', () => {
  let component: SelectorHotelComponent;
  let fixture: ComponentFixture<SelectorHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
