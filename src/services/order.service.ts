import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {GlobalResponseModel} from "../app/models/GlobalResponseModel";
import {OrderDto} from "../app/models/OrderDto";
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private httpClient: HttpClient) {
    }

    public getHttpOptions(): {} {
        return {
            headers: new HttpHeaders({'Content-Type': 'application/json'}),
            responseType: 'application/json'
        }
    }

    public createNewOrder(order: OrderDto): Observable<GlobalResponseModel> {
        if (order.isPickup) {
            // Stunden + 2 weil das Backend durch LocalDateTime wieder 2 Stunden abzieht
            order.pickupDate.setHours(order.pickupDate.getHours() + 2);
        }
        return this.httpClient.post<any>(`${environment.baseUrl}/api/deliveries/order`, order.toJson(), this.getHttpOptions())
            .pipe(map(response => new GlobalResponseModel(JSON.parse(response))));
    }
}
