import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { MyMockAPI } from './my-mock-api'


@Injectable({
  providedIn: 'root'
})
export class FlightService {
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private mockApi: MyMockAPI,
  ) {}


  getAirports(): Observable<any[]> {
    this.isLoading.next(true);
    return this.mockApi.getAirports().pipe(tap(() => this.isLoading.next(false)))
  }

  getFlights(payload: any): Observable<any[]> {
    this.isLoading.next(true);
    return this.mockApi.getFlights(payload).pipe(tap(() => this.isLoading.next(false)))
  }

}
