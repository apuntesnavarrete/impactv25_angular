import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollvisualComponent } from './rollvisual.component';

describe('RollvisualComponent', () => {
  let component: RollvisualComponent;
  let fixture: ComponentFixture<RollvisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollvisualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollvisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
