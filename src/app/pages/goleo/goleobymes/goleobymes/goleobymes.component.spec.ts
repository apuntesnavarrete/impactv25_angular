import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoleobymesComponent } from './goleobymes.component';

describe('GoleobymesComponent', () => {
  let component: GoleobymesComponent;
  let fixture: ComponentFixture<GoleobymesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoleobymesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoleobymesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
