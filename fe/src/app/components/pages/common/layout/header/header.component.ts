import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { SocketService } from 'src/app/services/socket/socket.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';

@UntilDestroy()
@Component({
  selector: 'app-header-final',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  name!: string;
  avatar!: any;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private mainService: MainService,
    private toastr: ToastrService,
    private socket: SocketService
  ) {}

  ngOnInit(): void {
    this.name = this.storageService.cookie.get('name');
    this.avatar = this.storageService.local.get('avatar');
    this.avatar = 'http://localhost:3003/' + this.avatar;
  }

  logout() {
    this.mainService.auth
      .logOut()
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          this.toastr.error(err.error.message, '', {
            timeOut: 2000,
          });
          return of(null);
        })
      )
      .subscribe((res: any) => {
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
        this.socket.sendMessage('leaveRoom', res.data);
        this.storageService.cookie.delete('id');
        this.storageService.cookie.delete('name');
        this.storageService.cookie.delete('email');
        this.storageService.cookie.removeAll();
        this.storageService.local.removeAll();
        this.router.navigate(['']);
      });
  }
}
