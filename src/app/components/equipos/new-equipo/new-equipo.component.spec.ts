import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEquipoComponent } from './new-equipo.component';

describe('NewEquipoComponent', () => {
  let component: NewEquipoComponent;
  let fixture: ComponentFixture<NewEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
