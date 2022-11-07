import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  currentRout: string;
  links = [
    { title: 'Search', target: '/search' },
    { title: 'My Bookings', target: '/bookings' }
  ];
  constructor(public route: ActivatedRoute) {
    this.currentRout = '/search';
  }

  ngOnInit(): void {
    this.currentRout = window.location.pathname === '/' ? '/search' : window.location.pathname;
  }

}
