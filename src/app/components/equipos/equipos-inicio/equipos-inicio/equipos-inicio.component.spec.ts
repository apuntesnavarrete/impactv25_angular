import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposInicioComponent } from './equipos-inicio.component';

describe('EquiposInicioComponent', () => {
  let component: EquiposInicioComponent;
  let fixture: ComponentFixture<EquiposInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
