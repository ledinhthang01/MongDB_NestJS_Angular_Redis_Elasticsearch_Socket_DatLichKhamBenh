import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-special-list',
  templateUrl: './special-list.component.html',
  styleUrls: ['./special-list.component.scss']
})
export class SpecialListComponent {
  @Input() title!: string;
  @Input() data: any;
  itemsPerSlide = 3;
  screenWidth!: number;

  constructor() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }
}
