import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { of } from 'rxjs'
import * as airportData from '../../assets/airports.json'
@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private airports = airportData
  constructor(
    private http: HttpClient,
  ) {}

  getAirports(): Observable<any> {
    console.log(this.airports.data);
    return of(this.airports.data)
  }
}
