import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosParentComponent } from './productos-parent.component';

describe('ProductosParentComponent', () => {
  let component: ProductosParentComponent;
  let fixture: ComponentFixture<ProductosParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
