import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysobservationsComponent } from './todaysobservations.component';

describe('TodaysobservationsComponent', () => {
  let component: TodaysobservationsComponent;
  let fixture: ComponentFixture<TodaysobservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaysobservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysobservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
