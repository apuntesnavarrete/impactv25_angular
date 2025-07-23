import { TestBed } from '@angular/core/testing';

import { PlayersStadisticsService } from './players-stadistics.service';

describe('PlayersStadisticsService', () => {
  let service: PlayersStadisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayersStadisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
