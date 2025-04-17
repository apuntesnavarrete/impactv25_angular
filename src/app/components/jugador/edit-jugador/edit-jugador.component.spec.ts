import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJugadorComponent } from './edit-jugador.component';

describe('EditJugadorComponent', () => {
  let component: EditJugadorComponent;
  let fixture: ComponentFixture<EditJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditJugadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
