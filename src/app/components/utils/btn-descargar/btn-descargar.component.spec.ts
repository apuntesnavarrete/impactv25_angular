import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnDescargarComponent } from './btn-descargar.component';

describe('BtnDescargarComponent', () => {
  let component: BtnDescargarComponent;
  let fixture: ComponentFixture<BtnDescargarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnDescargarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnDescargarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
