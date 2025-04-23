import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTableMainComponent } from './create-table-main.component';

describe('CreateTableMainComponent', () => {
  let component: CreateTableMainComponent;
  let fixture: ComponentFixture<CreateTableMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTableMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTableMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
