import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoleoLayerComponent } from './goleo-layer.component';

describe('GoleoLayerComponent', () => {
  let component: GoleoLayerComponent;
  let fixture: ComponentFixture<GoleoLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoleoLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoleoLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
