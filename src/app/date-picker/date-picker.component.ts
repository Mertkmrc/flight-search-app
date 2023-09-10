import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  Renderer2
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateStruct,
  NgbDatepicker,
  NgbDatepickerModule,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    NgbDatepicker,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  hoveredDate!: NgbDate | null;
  @Output() pickedDates = new EventEmitter<NgbDate[]>();
  @Input('pastDisabled') pastDisabled: boolean = false;
  @Input('autoSelectNow') autoSelectNow: boolean = false;
  @Input('oneWay') oneWay: boolean = false;
  fromDate!: NgbDate | null;
  today!: NgbDate;
  toDate!: NgbDate | null;
  minDate!: NgbDateStruct;
  markDisabled!: (date: NgbDate) => boolean;
  isAutoSelect = false;
  constructor(private calendar: NgbCalendar) {
    this.today = this.calendar.getToday();
    this.fromDate = this.today;
  }

  ngOnInit(): void {
    if (this.autoSelectNow) {
    }
  }
  onDateSelection(date: NgbDate | any) {
    console.log(date);
    if (this.oneWay) {
      this.fromDate = date;
      this.toDate = date;
      return;
    }
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      !this.oneWay &&
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isDisabledDay(date: NgbDate) {
    return date.before(this.today);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  onClose() {
    console.log('test');
    this.isAutoSelect = false;
    if (this.fromDate && this.toDate) {
      this.pickedDates.emit([this.fromDate, this.toDate]);
    }
  }
}
