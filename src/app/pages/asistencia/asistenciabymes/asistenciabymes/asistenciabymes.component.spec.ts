import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciabymesComponent } from './asistenciabymes.component';

describe('AsistenciabymesComponent', () => {
  let component: AsistenciabymesComponent;
  let fixture: ComponentFixture<AsistenciabymesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciabymesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciabymesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
