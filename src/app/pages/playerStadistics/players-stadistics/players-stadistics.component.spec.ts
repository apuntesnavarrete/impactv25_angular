import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersStadisticsComponent } from './players-stadistics.component';

describe('PlayersStadisticsComponent', () => {
  let component: PlayersStadisticsComponent;
  let fixture: ComponentFixture<PlayersStadisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersStadisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersStadisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
