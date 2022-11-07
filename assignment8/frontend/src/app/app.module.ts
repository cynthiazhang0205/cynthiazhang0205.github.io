import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchFormComponent } from './search-form/search-form.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { DetailsCardComponent } from './details-card/details-card.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { SearchRouteComponent } from './search-route/search-route.component';
import { ReservationRouteComponent } from './reservation-route/reservation-route.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps'
@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    ResultsTableComponent,
    DetailsCardComponent,
    ReservationFormComponent,
    SearchRouteComponent,
    ReservationRouteComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    GoogleMapsModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
