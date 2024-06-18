import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { MChat, MFetchChat } from 'src/app/shared/models/chat';
import { StorageService } from 'src/app/services/storage/storage.service';
import { GallerySearchComponent } from '../gallery-search/gallery-search.component';
import { SocketService } from 'src/app/services/socket/socket.service';

@UntilDestroy()
@Component({
  selector: 'app-chat-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  screenWidth!: number;
  data!: [MChat];
  dataFetchChat: any[] = [];
  idCurrent!: string;
  selectedItemId!: any;
  @Output() dataChat = new EventEmitter<any>();

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private storageService: StorageService,
    private socket: SocketService
  ) {
    this.screenWidth = window.innerWidth;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.idCurrent = this.storageService.cookie.get('id');
    this.fetchChat();
    this.socket.getMessage('messageRecieved').subscribe((res: any) => {
      const data = {
        _id: res.chat._id,
        senderName: res.sender.name,
        content: res.content,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      const index = this.dataFetchChat.findIndex(
        (item) => item._id === data._id
      );
      if (index !== -1) {
        this.dataFetchChat[index].createdAt = data.createdAt;
        this.dataFetchChat[index].updatedAt = data.updatedAt;
        this.dataFetchChat[index].latestMessage.sender.name = data.senderName;
        this.dataFetchChat[index].latestMessage.content = data.content;
      }
      this.dataFetchChat = this.sortByDate(this.dataFetchChat);
    });

    this.socket.getMessage('accessChat').subscribe((res: any) => {
      const user = res.users.find((user: MChat) => user._id !== this.idCurrent);
      if (user) {
        const newUser = {
          _id: res._id,
          chatName: user.name,
          isGroupChat: res.isGroupChat,
          avatar: user.avatar,
          latestMessage: res.latestMessage,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
        };
        this.dataFetchChat = this.sortByDate(
          this.dataFetchChat.concat(newUser)
        );
      }
    });
  }
  createGroupChat() {
    const dialogRef = this.dialog.open(GalleryComponent, {
      data: {
        size: { w: '600px', h: '250px' },
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const memberIds: string[] = res.users.map((item: any) => item._id);

        this.mainService.chat
          .createGroupChat({
            chatName: res.name,
            users: memberIds,
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
            const NewGroupChat = {
              _id: res.data._id,
              chatName: res.data.chatName,
              isGroupChat: res.data.isGroupChat,
              avatar: res.data.groupAdmin.avatar,
              createdAt: res.data.createdAt,
              updatedAt: res.data.updatedAt,
              latestMessage: res.data.latestMessage,
            };
            this.dataFetchChat = this.sortByDate(
              this.dataFetchChat.concat(NewGroupChat)
            );
            this.toastr.success(res.message, '', {
              timeOut: 2000,
            });
          });
      }
    });
  }

  fetchChat() {
    this.mainService.chat
      .fetchChats()
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
        this.dataFetchChat = this.sortByDate(this.filterChatData(res));
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
      });
    this.socket.sendMessage('chating', '');
  }

  openGalleryAccessChat() {
    const dialogRef = this.dialog.open(GallerySearchComponent, {
      data: {
        size: { w: '550px', h: '300px' },
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.accessChat(res);
      } else {
        this.toastr.error('Somethings went wrong!', '', {
          timeOut: 2000,
        });
      }
    });
  }

  sortByDate(objects: any[]) {
    return objects.sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  filterChatData(chat: MFetchChat): any {
    const filteredData: any[] = chat.data.map((item: any) => {
      if (item.isGroupChat) {
        return {
          _id: item._id,
          chatName: item.chatName,
          isGroupChat: item.isGroupChat,
          avatar: item.groupAdmin.avatar,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          latestMessage: item.latestMessage,
        };
      } else {
        const otherUser = item.users.find(
          (user: MChat) => user._id !== this.idCurrent
        );
        if (otherUser) {
          return {
            _id: item._id,
            chatName: otherUser.name,
            isGroupChat: item.isGroupChat,
            avatar: otherUser.avatar,
            latestMessage: item.latestMessage,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }
      }
      return null;
    });
    return filteredData;
  }

  accessChat(id: string) {
    this.mainService.chat
      .accessChat({ userId: id })
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
        // const user = res.data.users.find(
        //   (user: MChat) => user._id !== this.idCurrent
        // );
        // if (user) {
        //   const newUser = {
        //     _id: res.data._id,
        //     chatName: user.name,
        //     isGroupChat: res.data.isGroupChat,
        //     avatar: user.avatar,
        //     latestMessage: res.data.latestMessage,
        //     createdAt: res.data.createdAt,
        //     updatedAt: res.data.updatedAt,
        //   };
        //   this.dataFetchChat = this.sortByDate(
        //     this.dataFetchChat.concat(newUser)
        //   );
        // }
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
      });
  }

  deleteChat(id: string) {
    this.mainService.chat
      .deleteChat(id)
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
        this.dataFetchChat = this.dataFetchChat.filter(
          (item) => item._id !== id
        );
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
      });
  }

  getFullImagePath(imageName: string): string {
    return `http://localhost:3003/${imageName}`;
  }
}
