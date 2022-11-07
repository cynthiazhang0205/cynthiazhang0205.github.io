import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ReservationService } from '../app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ReservationFormComponent} from '../reservation-form/reservation-form.component';
@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsCardComponent implements OnInit {
  @Input() details: any;
  @Input() back: any;
  @Input() reviews: any;
  mapOptions: any = {
    center: {},
    zoom: 16
  };
  marker: any;
  constructor(config: NgbCarouselConfig, public reservations: ReservationService, private modalService: NgbModal) {
    config.interval = 10000000;
		config.wrap = true;
		config.keyboard = false;
		config.pauseOnHover = false;
   }

  ngOnInit(): void {
  }

  getCategory(categories: any[]): any {
    let cat = categories.map(category =>category.title);
    return cat.join(' | ');
  }

  getTwitterLink(details:any): any{
    return new URLSearchParams({text: `Check ${details.name} on Yelp.`,
    url: details.url
    }).toString()
  }

  getFacebookLink(details:any): any{
    return new URLSearchParams({
      u: details.url,
      src: 'sdkpreparse'
    }).toString();
  }

  ngOnChanges() {
    this.mapOptions.center = {
      lat: this.details.coordinates.latitude,
      lng: this.details.coordinates.longitude
    }
    this.marker = {
      lat: this.details.coordinates.latitude,
      lng: this.details.coordinates.longitude
    }
  }

  reserve(details:any) {
    const modalRef = this.modalService.open(ReservationFormComponent);
    modalRef.componentInstance.details = details;
    modalRef.componentInstance.reserve = this.doReserve.bind(this);
  //   this.reservations.set(details.id, {
  //     name: details.name,
  //     date: '2022-11-5',
  //     time: '12:55',
  //     email: '111@111',
  // })
  }

  doReserve(id:any, data:any) {
    this.reservations.set(id, data);
  }
}
