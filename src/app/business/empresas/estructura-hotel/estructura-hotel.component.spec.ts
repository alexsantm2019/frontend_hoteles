import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraHotelComponent } from './estructura-hotel.component';

describe('EstructuraHotelComponent', () => {
  let component: EstructuraHotelComponent;
  let fixture: ComponentFixture<EstructuraHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstructuraHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstructuraHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
