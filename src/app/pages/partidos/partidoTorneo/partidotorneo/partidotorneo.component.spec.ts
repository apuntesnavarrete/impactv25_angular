import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidotorneoComponent } from './partidotorneo.component';

describe('PartidotorneoComponent', () => {
  let component: PartidotorneoComponent;
  let fixture: ComponentFixture<PartidotorneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidotorneoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidotorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
