import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddequiposbytournamentsComponent } from './addequiposbytournaments.component';

describe('AddequiposbytournamentsComponent', () => {
  let component: AddequiposbytournamentsComponent;
  let fixture: ComponentFixture<AddequiposbytournamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddequiposbytournamentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddequiposbytournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
