import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav-final',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @Input() data!: any;
}
