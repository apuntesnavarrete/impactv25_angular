import { TestBed } from '@angular/core/testing';

import { PartidotorneoService } from './partidotorneo.service';

describe('PartidotorneoService', () => {
  let service: PartidotorneoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidotorneoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
