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
      link: '/admin',
    },
    {
      icon: 'person',
      name: 'Employee',
      link: 'create-employee',
    },
    {
      icon: 'business',
      name: 'Center',
      link: 'create-center',
    },
    // {
    //   icon: 'chat_bubble',
    //   name: 'Chat',
    //   link: 'chat',
    // },
  ];
}
