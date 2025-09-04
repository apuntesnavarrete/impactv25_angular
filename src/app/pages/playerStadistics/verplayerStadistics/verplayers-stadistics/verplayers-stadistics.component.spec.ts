import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerplayersStadisticsComponent } from './verplayers-stadistics.component';

describe('VerplayersStadisticsComponent', () => {
  let component: VerplayersStadisticsComponent;
  let fixture: ComponentFixture<VerplayersStadisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerplayersStadisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerplayersStadisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
