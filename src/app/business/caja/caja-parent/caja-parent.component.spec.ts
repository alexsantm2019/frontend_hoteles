import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaParentComponent } from './caja-parent.component';

describe('CajaParentComponent', () => {
  let component: CajaParentComponent;
  let fixture: ComponentFixture<CajaParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajaParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajaParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
