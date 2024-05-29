import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isActive(routePaths: string[]): boolean {
    return routePaths.some((path) => this.router.url.includes(path));
  }
}
