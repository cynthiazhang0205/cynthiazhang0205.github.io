import { Component, OnInit, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';

const SEARCH_URL = '/business';
const DETAIL_URL = '/details';
const REVIEW_URL = '/reviews';

@Injectable()
export class YelpService {
	constructor(private http: HttpClient) {}

	getBusinesses(query: any): Observable<any[]> {
		let ret = this.http
			.get<any>(SEARCH_URL + '?' + new URLSearchParams(query) )
			.pipe(map((response) => response.businesses));
    return ret;
	}

  getDetail(query: any): Observable<any[]>{
		let ret = this.http
			.get<any>(DETAIL_URL + `/${query}`)
			.pipe(map((response) => response));
    return ret;
	}

  getReviews(query: any): Observable<any> {
    let ret = this.http
    .get<any>(REVIEW_URL + `/${query}`)
    .pipe(map((response) => response.reviews));
  return ret;
  }

}

@Component({
  selector: 'app-search-route',
  templateUrl: './search-route.component.html',
  styleUrls: ['./search-route.component.css'],
  providers: [YelpService]
})
export class SearchRouteComponent implements OnInit {
  candidates:any = undefined;
  details!:any;
  reviews!:any;
  constructor(private yelpService: YelpService) { }

  ngOnInit(): void {
  }

  search(query:any):void {
    console.log(query);
    this.yelpService.getBusinesses(query).subscribe(businesses => this.candidates=businesses);
    this.details = undefined;
  }

  clear(): void{
    this.candidates = undefined;
    this.details = undefined;
  }

  show(id: any): void{
    this.yelpService.getDetail(id).subscribe(detail => this.details = detail);
    this.yelpService.getReviews(id).subscribe(reviews => this.reviews = reviews);
  }

  back(): void{
    this.details = undefined;
  }
}
