import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { SocketService } from 'src/app/services/socket/socket.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';
import { MGetAllMessages } from 'src/app/shared/models/message';
import { GalleryInfoComponent } from '../gallery-info/gallery-info.component';

@UntilDestroy()
@Component({
  selector: 'app-detail-chat',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnChanges {
  @Input() dataChat!: any;
  messages!: MGetAllMessages;
  idCurrent!: string;
  @ViewChild('scrollBottom') private scrollBottom!: ElementRef;
  isTyping: Boolean = false;

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private socket: SocketService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.idCurrent = this.storageService.cookie.get('id');
    this.socket.getMessage('messageRecieved').subscribe((res: any) => {
      this.messages.data.push(res.message);
    });

    this.socket.getMessage('typing').subscribe((res: any) => {
      this.isTyping = true;
    });

    this.socket.getMessage('StopTyping').subscribe((res: any) => {
      this.isTyping = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const idChat = changes['dataChat'].currentValue._id;
    this.mainService.message
      .getAllMessages({ id: idChat, page: 1 })
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
        this.messages = res;
        this.socket.sendMessage('join chat', idChat);
      });
  }

  form = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  keyFunction(event: any) {
    if (event.key == 'Enter') {
      this.send();
    }
  }
  get fc() {
    return this.form.controls;
  }
  send() {
    if (this.form.value.message) {
      this.mainService.message
        .sendMessage({
          chatId: this.dataChat._id,
          content: this.form.value.message as string,
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
          // this.messages.data.push(res.data);
          this.socket.sendMessage('new message', res.data);
          this.socket.sendMessage('StopTyping', this.dataChat._id);
        });
      this.form.reset();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onKeyUp(event: any) {
    this.socket.sendMessage('typing', this.dataChat._id);

    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= 3000) {
        this.socket.sendMessage('StopTyping', this.dataChat._id);
      }
    }, 3000);
  }

  scrollToBottom(): void {
    if (this.scrollBottom && this.scrollBottom.nativeElement) {
      this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  groupChatInfo(id: string) {
    const dialogRef = this.dialog.open(GalleryInfoComponent, {
      data: {
        size: { w: '600px', h: '750px' },
        id: id,
        groupName: this.dataChat.chatName,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {});
  }
}
