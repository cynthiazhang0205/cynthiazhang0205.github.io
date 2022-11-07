import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent implements OnInit {
  @Input() candidates: any;
  @Input() show: any;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  onSort(event: any): void {

  }

  toNumeric(num: number): number {
    return Math.round(num / 1609.344);
  }

}
