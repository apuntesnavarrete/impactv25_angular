import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablageneralComponent } from './tablageneral.component';

describe('TablageneralComponent', () => {
  let component: TablageneralComponent;
  let fixture: ComponentFixture<TablageneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablageneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablageneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
