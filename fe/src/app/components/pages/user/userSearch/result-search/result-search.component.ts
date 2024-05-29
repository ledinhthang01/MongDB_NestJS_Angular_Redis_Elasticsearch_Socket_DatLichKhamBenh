import { Component, HostListener, Input } from '@angular/core';
import { previewPost } from 'src/app/shared/models/post';

@Component({
  selector: 'app-result-search',
  templateUrl: './result-search.component.html',
  styleUrls: ['./result-search.component.scss'],
})
export class ResultSearchComponent {
  screenWidth!: number;
  @Input() data: previewPost[] = [];

  constructor() {
    this.screenWidth = window.innerWidth;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }
}
