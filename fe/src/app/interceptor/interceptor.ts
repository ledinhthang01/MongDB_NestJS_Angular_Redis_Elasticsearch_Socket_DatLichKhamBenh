import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { MainService } from '../services/user/main.service';
import { StorageService } from '../services/storage/storage.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private mainService: MainService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const excludedUrls = [
      '/booking',
      /\/users\/getInforUser\/\w+/,
      /\/doctor\/get-detail-infor-doctor-by-user\/\w+/,
      /\/center\/get-detail-infor-center-by-user\/\w+/,
      /\/booking\/getDatesAuthe\/\w+/,
      '/chat/find-member',
      '/chat',
      '/chat/delete-chat/',
      '/chat/create-group-chat',
      /\/message\/get-all-message\/\w+/,
      '/message/send-message',
      '/chat/add-member-to-group',
      '/chat/remove-member-in-group',
      '/chat/rename-group-chat',
      /\/message\/delete-message\/\w+/,
      '/message/edit-message',
    ];

    const showLoading = !excludedUrls.some((url) =>
      this.isUrlExcluded(req.url, url)
    );

    if (showLoading) {
      this.loadingService.showLoading();
    }

    if (!req.url.includes('/users/refreshToken')) {
      req = this.addAccessToken(req);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 405) {
          return this.mainService.auth.refreshToken().pipe(
            switchMap((res: any) => {
              this.storageService.local.removeAll();
              this.storageService.local.set(
                'accessToken',
                res.data.newAccessToken
              );
              this.storageService.local.set(
                'refreshToken',
                res.data.newRefreshToken
              );
              req = this.addAccessToken(req);
              return next.handle(req);
              this.loadingService.hideLoading();
            }),
            catchError((err) => throwError(err))
          );
        } else if (error.status === 501) {
          this.loadingService.hideLoading();
          this.router.navigate(['/auth']);
          this.toastr.info(error.error.errors, '', {
            timeOut: 2000,
          });
          return throwError(error);
        } else {
          this.loadingService.hideLoading();
          return throwError(error);
        }
      }),
      finalize(() => {
        this.loadingService.hideLoading();
      })
    );
  }

  private addAccessToken(req: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.storageService.local.get('accessToken');
    if (accessToken) {
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return req;
  }

  private isUrlExcluded(
    requestUrl: string,
    excludedUrl: string | RegExp
  ): boolean {
    if (typeof excludedUrl === 'string') {
      return requestUrl.includes(excludedUrl);
    } else if (excludedUrl instanceof RegExp) {
      return excludedUrl.test(requestUrl);
    }
    return false;
  }
}
