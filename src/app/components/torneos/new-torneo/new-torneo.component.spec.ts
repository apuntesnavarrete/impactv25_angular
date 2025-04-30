import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTorneoComponent } from './new-torneo.component';

describe('NewTorneoComponent', () => {
  let component: NewTorneoComponent;
  let fixture: ComponentFixture<NewTorneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTorneoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
