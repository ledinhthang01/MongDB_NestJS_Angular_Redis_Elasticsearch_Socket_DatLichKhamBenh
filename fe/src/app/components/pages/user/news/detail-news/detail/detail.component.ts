import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MDetailPost } from 'src/app/shared/models/post';

@UntilDestroy()
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  id!: any;
  data!: MDetailPost;
  safeHtmlDescription!: SafeHtml;
  time!: string;

  constructor(
    private route: ActivatedRoute,
    private mainService: MainService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.getDetailPost(this.id);
    });
  }

  getDetailPost(id: string) {
    this.mainService.post
      .getDetailPostById(id)
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
        this.safeHtmlDescription = this.data.data.content;
        this.time = moment(this.data.data.createTime).format('YYYY-MM-DD');
      });
  }
}
