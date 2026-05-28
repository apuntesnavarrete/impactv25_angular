import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VernewplayerStadisticsComponent } from './vernewplayer-stadistics.component';

describe('VernewplayerStadisticsComponent', () => {
  let component: VernewplayerStadisticsComponent;
  let fixture: ComponentFixture<VernewplayerStadisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VernewplayerStadisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VernewplayerStadisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
