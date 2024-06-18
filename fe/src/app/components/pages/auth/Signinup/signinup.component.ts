import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, timeout } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { ROOT_URL } from 'src/app/shared/contant/urls';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { GalleryComponent } from '../gallery/gallery.component';
import { ISignIn } from 'src/app/shared/interfaces/user';
import { FogotGalleryComponent } from '../fogot-gallery/fogot-gallery.component';
import { SocketService } from 'src/app/services/socket/socket.service';

@UntilDestroy()
@Component({
  selector: 'app-signinup',
  templateUrl: './signinup.component.html',
  styleUrls: ['./signinup.component.scss'],
})
export class SigninupComponent {
  @ViewChild('inputEmail') input!: ElementRef;

  isSubmitted = false;
  isSubmittedForgot = false;
  URL_SIGNIN = `${ROOT_URL}/google/google`;

  constructor(
    private userServiece: MainService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private socket: SocketService
  ) {
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 500);
  }

  showGallery() {
    const dialogRef = this.dialog.open(GalleryComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.signUp(res);
      }
    });
  }

  showFogotGallery() {
    const dialogRef = this.dialog.open(FogotGalleryComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.forgot(res);
      }
    });
  }

  signUp(data: any) {
    this.userServiece.auth
      .SignUp({
        email: data[0].email,
        name: data[0].name,
        phoneNumber: data[0].phoneNumber,
        address: data[0].address,
        gender: data[1],
        dateOfBirth: data[0].dateOfBirth,
      })
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          this.toastr.error(err?.error?.message ?? 'Something wrong!', '', {
            timeOut: 2000,
          });
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.toastr.success(res.message, '', {
            timeOut: 2000,
          });
        }
      });
  }

  get fcSignIn() {
    return this.formSignIn.controls;
  }

  formSignIn = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  SignIn() {
    this.isSubmitted = true;
    if (this.formSignIn.invalid) return;

    this.userServiece.auth
      .SignIn(this.formSignIn.value as ISignIn)
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          this.toastr.error(err?.error?.message ?? 'Something wrong!', '', {
            timeOut: 2000,
          });
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.toastr.success(res.message, '', {
            timeOut: 2000,
          });
          this.socket.sendMessage('signIn', res.data._id);
          this.router.navigate([res.data.url]);
        }
      });
  }

  formForgot = new FormGroup({
    emailForgot: new FormControl('', [Validators.required, Validators.email]),
  });

  forgot(data: any) {
    console.log(data);
  }
}
