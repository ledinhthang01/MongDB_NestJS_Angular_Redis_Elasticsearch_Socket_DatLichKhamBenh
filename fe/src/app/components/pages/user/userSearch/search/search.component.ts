import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MGetPosts } from 'src/app/shared/models/post';

@UntilDestroy()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  isSubmitted = false;
  data!: MGetPosts;
  page: number = 1;
  keyword: string = '';

  constructor(
    private toastr: ToastrService,
    private mainService: MainService
  ) {}

  myGroup = new FormGroup({
    searchString: new FormControl('', [Validators.required]),
  });

  get fc() {
    return this.myGroup.controls;
  }

  keyFunction(event: any) {
    if (event.key == 'Enter') {
      this.search();
    }
  }

  search() {
    this.isSubmitted = true;
    if (this.myGroup.invalid) {
      this.toastr.error('Please fill in data to search!', '', {
        timeOut: 2000,
      });
      return;
    }

    this.mainService.post
      .getAllPosts({
        page: 1,
        size: 10,
        keyword: this.fc['searchString'].value as string,
      })
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
        this.myGroup.reset();
      });
  }
}
