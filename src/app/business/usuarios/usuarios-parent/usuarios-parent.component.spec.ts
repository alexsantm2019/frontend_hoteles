import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosParentComponent } from './usuarios-parent.component';

describe('UsuariosParentComponent', () => {
  let component: UsuariosParentComponent;
  let fixture: ComponentFixture<UsuariosParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
