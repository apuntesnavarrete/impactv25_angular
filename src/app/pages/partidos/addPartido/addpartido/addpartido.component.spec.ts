import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpartidoComponent } from './addpartido.component';

describe('AddpartidoComponent', () => {
  let component: AddpartidoComponent;
  let fixture: ComponentFixture<AddpartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddpartidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
