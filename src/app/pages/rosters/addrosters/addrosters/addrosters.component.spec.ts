import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrostersComponent } from './addrosters.component';

describe('AddrostersComponent', () => {
  let component: AddrostersComponent;
  let fixture: ComponentFixture<AddrostersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddrostersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddrostersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
