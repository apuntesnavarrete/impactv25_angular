import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLigaComponent } from './menu-liga.component';

describe('MenuLigaComponent', () => {
  let component: MenuLigaComponent;
  let fixture: ComponentFixture<MenuLigaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuLigaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuLigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
