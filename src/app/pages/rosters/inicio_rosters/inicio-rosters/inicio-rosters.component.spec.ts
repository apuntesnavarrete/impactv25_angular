import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioRostersComponent } from './inicio-rosters.component';

describe('InicioRostersComponent', () => {
  let component: InicioRostersComponent;
  let fixture: ComponentFixture<InicioRostersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioRostersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioRostersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
