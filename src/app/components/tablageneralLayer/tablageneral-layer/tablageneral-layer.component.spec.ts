import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaGeneralLayerComponent } from './tablageneral-layer.component';


describe('TablageneralLayerComponent', () => {
  let component: TablaGeneralLayerComponent;
  let fixture: ComponentFixture<TablaGeneralLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaGeneralLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaGeneralLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
