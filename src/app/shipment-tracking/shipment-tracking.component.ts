import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {icon, Marker} from 'leaflet';
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {TrackingDialogComponent} from "../tracking-dialog/tracking-dialog.component";
import {TrackingServiceService} from "../../services/tracking-service.service";
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
        Validators.pattern("[0-9]*")
    ])

    constructor(public route: ActivatedRoute, public dialog: MatDialog, private trackingService: TrackingServiceService) {
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
            console.log(params);
            this.trackingId = params['trackingId'];
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
        let trackingId = this.trackingId;
        console.log("getDeliveryStatus mit trackingId: " + trackingId);
        this.openDialog();
        this.status = PackageStateEnum.DELIVERED;
        this.getPackageLocation();
    }

    public getPackageLocation(): void {
        // todo backend call

        // Ausschnitt auf der Karte setzen
        L.marker([47.99, 7.8]).addTo(this.map)
            .bindPopup('Headquarter Trouvaille Deliveries', {autoClose: false})
            .openPopup();

        L.marker([48, 7.85]).addTo(this.map)
            .bindPopup('Ihre Lieferung', {autoClose: false})
            .openPopup();

        // Add route from start to end to map
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
