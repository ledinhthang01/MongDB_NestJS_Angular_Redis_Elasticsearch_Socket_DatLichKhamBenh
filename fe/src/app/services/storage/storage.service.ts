import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private cookieService: CookieService) { }

  cookie = {
    set: (name: string, value: any) => {
      this.cookieService.set(name, value, 365);
    },
    get: (name: string) => {
      return this.cookieService.get(name);
    },
    delete: (name: string) => {
      this.cookieService.delete(name);
    },
    removeAll: () => {
      this.cookieService.deleteAll();
    }
  }

  local = {
    set: (name: string, value: any) => {
      localStorage.setItem(name, value);
    },
    get: (name: string) => {
      return localStorage.getItem(name);
    },
    delete: (name: string) => {
      localStorage.removeItem(name)
    },
    removeAll: () => {
      localStorage.clear();
    }
  }
}
