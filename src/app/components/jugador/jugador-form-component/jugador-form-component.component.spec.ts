import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugadorFormComponentComponent } from './jugador-form-component.component';

describe('JugadorFormComponentComponent', () => {
  let component: JugadorFormComponentComponent;
  let fixture: ComponentFixture<JugadorFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JugadorFormComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JugadorFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
