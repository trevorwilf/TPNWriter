import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectrolyteinfoComponent } from './electrolytes.component';

describe('PatientinfoComponent', () => {
  let component: ElectrolyteinfoComponent;
  let fixture: ComponentFixture<ElectrolyteinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectrolyteinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectrolyteinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
