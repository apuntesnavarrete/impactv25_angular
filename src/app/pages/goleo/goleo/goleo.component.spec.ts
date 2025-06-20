import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoleoComponent } from './goleo.component';

describe('GoleoComponent', () => {
  let component: GoleoComponent;
  let fixture: ComponentFixture<GoleoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoleoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoleoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
