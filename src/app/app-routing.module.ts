import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {OrderComponent} from "./order/order.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {ShipmentTrackingComponent} from "./shipment-tracking/shipment-tracking.component";
import {CancellationComponent} from "./cancellation/cancellation.component";

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'order', component: OrderComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'shipment-tracking', component: ShipmentTrackingComponent},
    {path: 'cancellation', component: CancellationComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
