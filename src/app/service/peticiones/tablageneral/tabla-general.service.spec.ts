import { TestBed } from '@angular/core/testing';

import { TablaGeneralService } from './tabla-general.service';

describe('TablaGeneralService', () => {
  let service: TablaGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
