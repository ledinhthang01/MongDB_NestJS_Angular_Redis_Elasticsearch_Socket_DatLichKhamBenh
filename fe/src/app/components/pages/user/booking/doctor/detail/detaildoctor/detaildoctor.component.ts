import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-detaildoctor',
  templateUrl: './detaildoctor.component.html',
  styleUrls: ['./detaildoctor.component.scss']
})
export class DetaildoctorComponent {
  screenWidth!: number;
  selectedTime: string = '';
  selectedTimeIndex: number = -1;
  times = ['08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00', '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00',]

  constructor() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  selectTime(index: number): void {
    this.selectedTimeIndex = index;
  }
}
