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
      link: '/employee',
    },
    {
      icon: 'create',
      name: 'Create post',
      link: 'create-post',
    },
    {
      icon: 'chat_bubble',
      name: 'Chat',
      link: 'chat',
    },
  ];
}
