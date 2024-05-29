import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  inputValue: string = '';

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() placeholder!: string;
  @Input() searchString!: string;
}
