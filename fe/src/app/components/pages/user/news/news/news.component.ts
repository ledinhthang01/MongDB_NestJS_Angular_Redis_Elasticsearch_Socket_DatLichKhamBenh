import { HttpParams } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MGetPosts } from 'src/app/shared/models/post';

@UntilDestroy()
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  screenWidth!: number;
  data!: MGetPosts;
  constructor(private toastr: ToastrService, private mainService: MainService) {
    this.screenWidth = window.innerWidth;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }
  ngOnInit(): void {
    this.getAllPosts();
  }
  getAllPosts() {
    this.mainService.post
      .getAllPosts({ page: 1, size: 10, keyword: '' })
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
        this.data = res;
      });
  }
}
