import { TestBed } from '@angular/core/testing';

import { GoleadoresService } from './goleadores.service';

describe('GoleadoresService', () => {
  let service: GoleadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoleadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
