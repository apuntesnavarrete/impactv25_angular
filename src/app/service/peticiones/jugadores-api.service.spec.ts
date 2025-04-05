import { TestBed } from '@angular/core/testing';

import { JugadoresApiService } from './jugadores-api.service';

describe('JugadoresApiService', () => {
  let service: JugadoresApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JugadoresApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
