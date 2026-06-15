import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilarollComponent } from './filaroll.component';

describe('FilarollComponent', () => {
  let component: FilarollComponent;
  let fixture: ComponentFixture<FilarollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilarollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilarollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
