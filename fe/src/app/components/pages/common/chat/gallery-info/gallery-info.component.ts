import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MChat, MGetAllMemberInGroupChat } from 'src/app/shared/models/chat';

@UntilDestroy()
@Component({
  selector: 'app-gallery-info',
  templateUrl: './gallery-info.component.html',
  styleUrls: ['./gallery-info.component.scss'],
})
export class GalleryInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GalleryInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any,
    private mainService: MainService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.size = dataParent?.size;
    this.idGroupChat = dataParent?.id;
    this.groupName = dataParent?.groupName;
    this.dialogRef.updateSize(this.size.w, this.size.h);
  }

  size: any;
  idGroupChat!: string;
  allMember!: MGetAllMemberInGroupChat;
  searchControl = new FormControl();
  data: MChat[] = [];
  groupName!: string;

  ngOnInit(): void {
    this.getAllMemberInGroupChat();

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.findUser(value);
      });
  }

  getAllMemberInGroupChat() {
    this.mainService.chat
      .getAllMemberInGroupChat(this.idGroupChat)
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
        this.allMember = res;
      });
  }

  removeMember(id: string) {
    this.mainService.chat
      .removeMember({ chatId: this.idGroupChat, userId: id })
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
        this.allMember.data = res.data.users;
      });
  }

  addMember(id: string) {
    this.mainService.chat
      .addMemberToGroup({ chatId: this.idGroupChat, userId: id })
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
        this.allMember.data = res.data.users;
      });
  }

  findUser(value: string) {
    this.mainService.chat
      .findUser(value)
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
        this.data = res.data;
      });
  }

  form = new FormGroup({
    name: new FormControl(),
  });

  changeNameGroup() {
    this.mainService.chat
      .renameGroupChat({ chatId: this.idGroupChat, name: this.form.value.name })
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
        this.groupName = res.data;
        location.reload();
      });
  }
}
