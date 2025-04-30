import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTorneoComponent } from './edit-torneo.component';

describe('EditTorneoComponent', () => {
  let component: EditTorneoComponent;
  let fixture: ComponentFixture<EditTorneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTorneoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
