import { TestBed } from '@angular/core/testing';

import { EquiposApiService } from './teams.service';

describe('TeamsService', () => {
  let service: EquiposApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquiposApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
