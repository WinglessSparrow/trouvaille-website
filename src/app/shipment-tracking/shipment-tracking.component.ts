import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {icon, Marker} from 'leaflet';
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {TrackingDialogComponent} from "../modal/tracking-dialog/tracking-dialog.component";
import {TrackingService} from "../../services/tracking.service";
import {Coordinate} from "../models/Coordinate";
import {PackageStateEnum} from "../models/PackageStateEnum";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

declare var require: any;


@Component({
    selector: 'shipment-tracking',
    templateUrl: './shipment-tracking.component.html',
    styleUrls: ['./shipment-tracking.component.scss']
})
export class ShipmentTrackingComponent implements OnInit, AfterViewInit {

    faCheck = faCheck;

    private map: any;

    public trackingId!: number;
    public headquarter!: Coordinate;
    public destination!: Coordinate;
    public status!: PackageStateEnum;

    trackingForm = new FormControl("", [
        Validators.required,
        // Validators.pattern("[0-9]*")
    ])

    constructor(private route: ActivatedRoute, private dialog: MatDialog, private trackingService: TrackingService) {
    }

    ngOnInit(): void {
        this.headquarter = new Coordinate();
        this.headquarter.longitude = 7.8;
        this.headquarter.latitude = 47.99;
        this.destination = new Coordinate();
        this.destination.longitude = 7.85;
        this.destination.latitude = 48;
    }

    ngAfterViewInit(): void {
        this.initMap();
        this.route.queryParams.subscribe(params => {
            this.trackingId = params['trackingId'];
            this.trackingForm.setValue(this.trackingId);
            this.getDeliveryStatus();
        })
    }

    private initMap(): void {
        let iconRetinaUrl = 'assets/marker-icon-2x.png';
        let iconUrl = 'assets/marker-icon.png';
        let shadowUrl = 'assets/marker-shadow.png';
        const iconDefault = icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        Marker.prototype.options.icon = iconDefault;

        this.map = L.map('map', {
            center: [47.9990077, 7.8421043],
            zoom: 3
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 8,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        this.map.setZoom(13);
        tiles.addTo(this.map);

    }

    public getDeliveryStatus(): void {
        this.trackingId = this.trackingForm.value;
        let trackingId = this.trackingId;

        // delivery-status von backend anfordern
        this.trackingService.getPackageHistory(this.trackingId.toString()).subscribe(response => {
            if (response.hasError) {
                this.openDialog();
            } else {
                // aktuellsten Status aus dem history-Array rausnehmen
                console.log(response);
                this.status = response.data[0][0].status;
            }
        })
        this.getPackageLocation();
    }

    public getPackageLocation(): void {
        // todo backend call für aktuelle Position

        // Ausschnitt auf der Karte setzen
        L.marker([47.99, 7.8]).addTo(this.map)
            .bindPopup('Headquarter Trouvaille Deliveries', {autoClose: false})
            .openPopup();

        L.marker([48, 7.85]).addTo(this.map)
            .bindPopup('Ihre Lieferung', {autoClose: false})
            .openPopup();

        // Add route (polyline) from start to end to map
        this.trackingService.getRouteFromOsrm(this.headquarter, this.destination).subscribe(jsonRoute => {
            let route = JSON.parse(jsonRoute);
            let polyUtil = require('polyline-encoded');
            const latlngs = polyUtil.decode(route.routes[0].geometry, 5);
            L.polyline(latlngs).addTo(this.map);
        })
    }

    public openDialog(): void {

        this.dialog.open(TrackingDialogComponent, {
            data: {
                title: 'Fehler bei der Sendungsverfolgung',
                content: 'Die von Ihnen eingegebene Sendungsnummer wurde im System nicht gefunden'
            }
        })
    }
}
