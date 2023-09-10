import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { FlightService } from './services/flight.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlightBody, flightDto } from './services/my-mock-api';
import { Sort } from '@angular/material/sort';


type Tabs =
  | 'Departure' | 'Return';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  inputForm!: FormGroup;
  departureAirports: any[] = []
  destinationAirports: any[] = []
  isOneWay: boolean = false;
  currentTab: Tabs = 'Departure'
  showTable = false
  tableData: flightDto[] = []
  flightData: any[] = []
  departureList: Observable<any[]>;
  destinationList: Observable<any[]>;
  chosenDate: string;
  validation_msgs = {
    'airports': [
      { type: 'invalidAutocompleteObject', message: 'Input is not recognized. Click one of the options.' },
      { type: 'required', message: 'Input is required.' }
    ],

  }

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private spinner: NgxSpinnerService
  ) {
  }


  ngOnInit(): void {
    this.flightService.isLoading.subscribe(isLoading => {
      (isLoading) ? this.spinner.show() : this.spinner.hide()
    })
    this.inputForm = this.fb.group({
      departure : ['',[Validators.required, RequireMatch]],
      destination: ['',[Validators.required, RequireMatch]],
      oneWay: [false, Validators.required],
      returnDate:['',Validators.required],
      departureDate: ['', Validators.required],
    });
    this.getAirports()
  }

  getAirports() {
    this.flightService.getAirports().subscribe((res: any) => {
      this.departureAirports = [...res]
      this.destinationAirports = [...res]
      this.departureList = this.inputForm.controls.departure.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.city;
          return name ? this._filterDeparture(name as string) : this.departureAirports;
        }),
      );
      this.destinationList = this.inputForm.controls.destination.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.city;
          return name ? this._filterDestination(name as string) : this.destinationAirports;
        }),
      );
    })
  }

  pickedDates(event: any) {
    const departureDate = new Date(event[0].year, event[0].month - 1, event[0].day);
    const returnDate = new Date(event[1].year, event[1].month - 1, event[1].day);
    this.inputForm.controls.departureDate.setValue(departureDate.toLocaleString())
    this.inputForm.controls.returnDate.setValue(returnDate.toLocaleString())
  }

  onSearch() {
    const payload: FlightBody = {
      originCode: this.inputForm.controls.departure.value.iata_code,
      destinationCode: this.inputForm.controls.destination.value.iata_code,
      oneWay: this.inputForm.controls.oneWay.value,
      departureDate: this.inputForm.controls.departureDate.value,
      returnDate: this.inputForm.controls.returnDate.value
    }
    this.flightService.getFlights(payload).subscribe(res => {
      this.showTable = true
      this.flightData = res
      this.tableData = this.flightData[0]
      this.chosenDate = this.inputForm.controls.departureDate.value
    })
  }

  activeClass(tab: Tabs ){
    return tab === this.currentTab ? 'show active' : '';
  }
  setTab(tab: Tabs) {
    const idx = tab === 'Departure' ? 0 :1
    this.chosenDate = tab === 'Departure' ? this.inputForm.controls.departureDate.value : this.inputForm.controls.returnDate.value
    this.currentTab = tab;
    this.tableData = this.flightData[idx]
  }
  sortData(sort: Sort) {
    const data = this.flightData[0].slice();
    if (!sort.active || sort.direction === '') {
      this.tableData = data;
      return;
    }

    this.tableData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'departure':
          return compare(a.departureDateTime, b.departureDateTime, isAsc);
        case 'arrival':
          return compare(a.arrivalDateTime, b.arrivalDateTime, isAsc);
        case 'duration':
          return compare(a.plannedFlightDuration, b.plannedFlightDuration, isAsc);
        case 'price':
          return compare(a.price, b.price, isAsc);
        default:
          return 0;
      }
    });
  }


  displayFn(airport: any): string {
    return airport && airport.city ? airport.name +' - ' + airport.city : '';
  }

  private _filterDeparture(name: string): any[] {
    const filterValue = name.toLowerCase();
    return [...this.departureAirports.filter(airport => airport.city.toLowerCase().includes(filterValue) || airport.iata_code.toLowerCase().includes(filterValue))];
  }
  private _filterDestination(name: string): any[] {
    const filterValue = name.toLowerCase();
    let out = [...this.destinationAirports.filter(airport => airport.city.toLowerCase().includes(filterValue) || airport.iata_code.toLowerCase().includes(filterValue))]
    if (this.inputForm.controls.departureDate.value !== '') {
      out = out.filter(o => o.iata_code !== this.inputForm.controls.destination.value.iata_code)
    }
    return out;
  }
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
export function RequireMatch(control: AbstractControl) {
  // hack coz we are using an object
  if (typeof control.value === 'string') {
    return { 'invalidAutocompleteObject': { value: control.value } }
  }
  return null;
}
