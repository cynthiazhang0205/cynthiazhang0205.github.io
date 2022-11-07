import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationRouteComponent } from './reservation-route.component';

describe('ReservationRouteComponent', () => {
  let component: ReservationRouteComponent;
  let fixture: ComponentFixture<ReservationRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
