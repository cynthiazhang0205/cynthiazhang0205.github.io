import { Component, OnInit, Injectable } from '@angular/core';

import {ReservationService} from '../app.component';



@Component({
  selector: 'app-reservation-route',
  templateUrl: './reservation-route.component.html',
  styleUrls: ['./reservation-route.component.css']
})
export class ReservationRouteComponent implements OnInit {
  count: number = 0;
  keys: any[] = [];
  constructor(public reservations: ReservationService) {
    reservations.get_length().subscribe(res => this.count = res);
    reservations.get_keys().subscribe(res => this.keys = res);
  }

  ngOnInit(): void {
  }

  delete(key: string): void {
    this.reservations.remove(key);
  }

}
