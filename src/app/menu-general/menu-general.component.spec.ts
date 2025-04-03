import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGeneralComponent } from './menu-general.component';

describe('MenuGeneralComponent', () => {
  let component: MenuGeneralComponent;
  let fixture: ComponentFixture<MenuGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
