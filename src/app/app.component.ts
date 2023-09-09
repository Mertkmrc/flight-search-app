import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { FlightService } from './services/flight.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  inputForm!: FormGroup;
  departureAirports: any[] = []
  destinationAirports: any[] = []
  departureList: Observable<any[]>;
  destinationList: Observable<any[]>;
  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
  ) {
  }

  test() {
    console.log(this.inputForm);
  }
  ngOnInit(): void {
    this.inputForm = this.fb.group({
      departure : ['',Validators.required],
      destination: ['',Validators.required],
      roundTrip: [true],
      oneWay: [false],
      departureDate:['',Validators.required],
      arrivalDate: ['', Validators.required],
    });
    this.getAirports()
  }

  getAirports() {
    this.flightService.getAirports().subscribe((res: any) => {
      this.departureAirports = [...res]
      this.destinationAirports = [...res]
      console.log(res);
      this.departureList = this.inputForm.controls.departure.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.city;
          console.log(name);
          return name ? this._filterDeparture(name as string) : this.departureAirports;
        }),
      );
      this.destinationList = this.inputForm.controls.destination.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.city;
          console.log(name);
          return name ? this._filterDestination(name as string) : this.destinationAirports;
        }),
      );
    })
  }

  displayFn(user: any): string {
    // return ''
    return user && user.city ? user.city : '';
  }

  private _filterDeparture(name: string): any[] {
    const filterValue = name.toLowerCase();
    // return []
    console.log(this.departureAirports.filter(airport => airport.city.toLowerCase().includes(filterValue) || airport.iata_code.toLowerCase().includes(filterValue)));
    return [...this.departureAirports.filter(airport => airport.city.toLowerCase().includes(filterValue) || airport.iata_code.toLowerCase().includes(filterValue))];
  }
  private _filterDestination(name: string): any[] {
    const filterValue = name.toLowerCase();
    // return []
    console.log(this.destinationAirports.filter(airport => airport.city.toLowerCase().includes(filterValue) || airport.iata_code.toLowerCase().includes(filterValue)));
    return [...this.destinationAirports.filter(airport => airport.city.toLowerCase().includes(filterValue) || airport.iata_code.toLowerCase().includes(filterValue))];
  }
}


