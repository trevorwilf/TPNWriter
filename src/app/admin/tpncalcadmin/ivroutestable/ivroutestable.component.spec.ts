import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IVroutestableComponent } from './ivroutestable.component';

describe('IVroutestableComponent', () => {
  let component: IVroutestableComponent;
  let fixture: ComponentFixture<IVroutestableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IVroutestableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IVroutestableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
