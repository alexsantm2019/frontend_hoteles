import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoFormComponent } from './consumo-form.component';

describe('ConsumoFormComponent', () => {
  let component: ConsumoFormComponent;
  let fixture: ComponentFixture<ConsumoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
