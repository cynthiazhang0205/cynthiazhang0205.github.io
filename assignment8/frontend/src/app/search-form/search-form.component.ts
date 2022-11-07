import { Component, OnInit, Injectable, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
const AUTOCOMPLETE_URL = '/autocomplete';
const PARAMS = new HttpParams({
	fromObject: {
		text: '',
	},
});
@Injectable()
export class AutocompleteService {
	constructor(private http: HttpClient) {}

	search(term: string) {
		if (term === '') {
			return of([]);
		}

		let ret = this.http
			.get<string[]>(AUTOCOMPLETE_URL, { params: PARAMS.set('text', term) })
			.pipe(map((response) => response));
    return ret;
	}
}

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  providers: [AutocompleteService],
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  searching = false;
	searchFailed = false;
	term: any = '';
  distance: any;
  categories: any = 'all';
  auto: boolean = false;
  location: any;
  @ViewChild('myForm') ngForm!: NgForm;
  @ViewChild('submitBtn') private buttonSubmit!:ElementRef;
  @ViewChild('termInput') private termInput!: ElementRef;
  @ViewChild('locationInput') private locationInput!: ElementRef;

  @Input() query!: (args: any) => void;
  @Input() clear!: () => void;
  constructor(private _service: AutocompleteService) {
  }
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => (this.searching = true)),
    switchMap((term) =>
      this._service.search(term).pipe(
        tap(() => (this.searchFailed = false)),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }),
      ),
    ),
    tap(() => (this.searching = false)),
  );
  submit = () => {
    this.ngForm.form.markAllAsTouched();
    let query: any = {
      term: this.term,
      radius: this.distance? this.distance: 10,
      categories: this.categories,
      location: this.auto? '' : this.location
    }
    // console.log(query);
    if (this.termInput.nativeElement.reportValidity() && this.locationInput.nativeElement.reportValidity()) {
      this.query(query);
    }
  }
  ngOnInit(): void {
  }

}
