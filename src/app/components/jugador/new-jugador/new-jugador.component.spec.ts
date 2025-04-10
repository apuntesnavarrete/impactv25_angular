import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJugadorComponent } from './new-jugador.component';

describe('NewJugadorComponent', () => {
  let component: NewJugadorComponent;
  let fixture: ComponentFixture<NewJugadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewJugadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
