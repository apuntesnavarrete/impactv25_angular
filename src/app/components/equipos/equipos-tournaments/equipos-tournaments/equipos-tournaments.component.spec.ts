import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposTournamentsComponent } from './equipos-tournaments.component';

describe('EquiposTournamentsComponent', () => {
  let component: EquiposTournamentsComponent;
  let fixture: ComponentFixture<EquiposTournamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposTournamentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
