import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreetpnComponent } from './freetpn.component';

describe('FreetpnComponent', () => {
  let component: FreetpnComponent;
  let fixture: ComponentFixture<FreetpnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreetpnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
