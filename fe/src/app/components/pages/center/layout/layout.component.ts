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
      link: '/center',
    },
    {
      icon: 'person',
      name: 'Doctor',
      link: 'doctor',
    },
    {
      icon: 'calendar_today',
      name: 'Calendar',
      link: 'calendar',
    },
    // {
    //   icon: 'chat_bubble',
    //   name: 'Chat',
    //   link: 'chat',
    // },
  ];
}
