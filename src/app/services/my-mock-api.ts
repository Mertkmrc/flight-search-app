import { Injectable } from "@angular/core";
import { Observable, delay, of } from "rxjs";
import * as airportData from '../../assets/airports.json'
import * as flightData from '../../assets/flights.json'

export interface FlightBody {
  originCode: string;
  destinationCode:string;
  oneWay: boolean;
  departureDate: string;
  returnDate?: string;
}

export interface flightDto   {
  arrivalDateTime: number;
  arrivalDateTimeTimeZone: string;
  departureDateTime: number;
  departureDateTimeTimeZone: string;
  journeyDuration: number;
  flightNumber: string;
  airline: {
      shortName: string;
      longName: string;
  },
  flightDuration: number;
  arrivalDateTimeDisplay: string;
  departureDateTimeDisplay: string;
  relevantAirline: {
      shortName:string;
      longName: string;
  },
  originAirport: {
      name: string;
      code: string;
      city: string;
      country: string;
  },
  destinationAirport: {
  name: string;
      code: string;
      city: string;
      country: string;
  },
  plannedFlightDuration: number;
  plannedFlightDurationDisplay?: string;
  price?: number;
}
@Injectable()
export class MyMockAPI {
  private airports = airportData
  private flights = flightData

  getAirports(): Observable<any[]> {
    return of(this.airports.data.slice(0,10)).pipe(delay(2000))
  }

  getFlights(payload: FlightBody): Observable<any[]> {
    const priceArr = [20,30,40,50,60]
    const flightList: flightDto[] = [...this.flights.data]
    const out: any[] = []
    const departureMatch = flightList.filter((o:any) => o.originAirport.code === payload.originCode &&
    o.destinationAirport.code === payload.destinationCode &&
    o.departureDateTimeDisplay.split(',')[0] === payload.departureDate.split(',')[0])
    departureMatch.forEach((item,idx)=> {
      item.plannedFlightDuration -= idx * 180000
      const d = new Date(item.plannedFlightDuration)
      item.plannedFlightDurationDisplay = d.toLocaleString()
      item.price = priceArr[idx]
    })
    out.push(departureMatch)
    if (!payload.oneWay) {
      const returnMatch = flightList.filter((o:any) => o.originAirport.code === payload.destinationCode &&
      o.destinationAirport.code === payload.originCode &&
      o.departureDateTimeDisplay.split(',')[0] === payload.returnDate.split(',')[0]  )
      returnMatch.forEach((item,idx)=> {
        item.plannedFlightDuration -= idx * 180000
        const d = new Date(item.plannedFlightDuration)
        item.plannedFlightDurationDisplay = d.toLocaleString()
        item.price = priceArr[idx]
      })
      out.push(returnMatch)

    }
    return of(out).pipe(delay(2000))
  }
}
