import { TestBed } from '@angular/core/testing';

import { RostersService } from './rosters.service';

describe('RostersService', () => {
  let service: RostersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RostersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
