import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  sideBarOpen = true;
  data = [
    {
      icon: 'dashboard',
      name: 'Dashboard',
      link: '/doctor',
    },
    {
      icon: 'person',
      name: 'Register plan',
      link: 'register-plan',
    },
    {
      icon: 'calendar_today',
      name: 'Booking',
      link: 'booking',
    },
    {
      icon: 'chat_bubble',
      name: 'Chat',
      link: 'chat',
    },
  ];
}
