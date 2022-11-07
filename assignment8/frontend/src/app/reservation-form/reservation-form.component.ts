import { Component, OnInit, Input, ViewChild, ElementRef, Injectable } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ReservationService } from '../app.component';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[1], 10),
				month: parseInt(date[0], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
    if (date?.day){
      return `${date?.month}/${date?.day}/${date?.year}`;
    } else {
      return '';
    }
	}
}


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class ReservationFormComponent implements OnInit {
  @Input() details: any;
  @Input() reserve: any;
  @ViewChild('form') form!: ElementRef;
  @ViewChild('dateInput') dateInput!: ElementRef;
  @ViewChild('hourInput') hourInput!: ElementRef;
  @ViewChild('minuteInput') minuteInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  minute!: any;
  hour!: any;
  constructor(public activeModal: NgbActiveModal, public calendar: NgbCalendar) { 
    let today = calendar.getToday();
  }

  ngOnInit(): void {
    this.calendar
  }

  onSubmit(): void {
    this.form.nativeElement.classList.add('was-validated');
    if (this.form.nativeElement.checkValidity()) {
      this.reserve(this.details.id, {
        name: this.details.name,
        email: this.emailInput.nativeElement.value,
        date: this.dateInput.nativeElement.value,
        time: `${this.hourInput.nativeElement.value}:${this.minuteInput.nativeElement.value}`
      })
      this.activeModal.close();
    }
  }

}
