import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchRouteComponent } from './search-route/search-route.component';
import { ReservationRouteComponent } from './reservation-route/reservation-route.component';

const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full'},
  { path: 'search', component: SearchRouteComponent},
  { path: 'bookings', component: ReservationRouteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
