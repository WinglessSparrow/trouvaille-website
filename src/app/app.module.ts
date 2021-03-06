import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { OrderComponent } from './order/order.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { AboutUsComponent } from './about-us/about-us.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ShipmentTrackingComponent } from './shipment-tracking/shipment-tracking.component';
import { SideHeaderComponent } from './side-header/side-header.component';
import { TrackingDialogComponent } from './modal/tracking-dialog/tracking-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CancellationComponent } from './cancellation/cancellation.component';
import { SuccessDialogComponent } from './modal/success-dialog/success-dialog.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        FooterComponent,
        OrderComponent,
        AboutUsComponent,
        ShipmentTrackingComponent,
        SideHeaderComponent,
        TrackingDialogComponent,
        CancellationComponent,
        SuccessDialogComponent,
        LegalNoticeComponent,
        DataPrivacyComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientModule,
        NgxsModule.forRoot([], {
            developmentMode: !environment.production,
        }),
        NgxsSelectSnapshotModule,
        NgxsLoggerPluginModule.forRoot(),
        MatStepperModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxPayPalModule,
        MatDialogModule,
    ],
    providers: environment.IOC,
    bootstrap: [AppComponent],
})
export class AppModule {}
