import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private authService: StorageService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.local.get('accessToken')) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false; 
    }
  }
}
