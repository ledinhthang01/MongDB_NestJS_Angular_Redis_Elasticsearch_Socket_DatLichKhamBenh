import { Component, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of, tap } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/components/guards/can-deactivate-guard.guard';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';
import { GalleryComponent } from '../gallery/gallery.component';

@UntilDestroy()
@Component({
  selector: 'app-employee-create-post',
  templateUrl: './employee-create-post.component.html',
  styleUrls: ['./employee-create-post.component.scss'],
})
export class EmployeeCreatePostComponent implements CanComponentDeactivate {
  isSubmitted = false;
  multipleimage = [];
  urls: any[] = [];
  mainImage: any;
  avatar: any;
  uploadedImages: any[] = [];

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canDeactivate(): Observable<boolean> | boolean {
    const dialogRef = this.dialog.open(GalleryComponent, {
      data: {
        size: { w: '300px', h: '180px' },
      },
    });
    return dialogRef.afterClosed();
  }

  ngOnInit(): void {
    const idPost = this.storageService.local.get('idPost');
    if (idPost) {
      this.deletePost(idPost);
      this.storageService.local.delete('idPost');
    }
    this.createPost();
    this.editor = new Editor();
  }

  deletePost(id: string) {
    this.mainService.post
      .deletePost(id)
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
        this.storageService.local.delete('idPost');
      });
  }

  get doc(): AbstractControl {
    return this.myForm.get('editorContent') as AbstractControl;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  createPost() {
    this.mainService.post
      .createPost(this.storageService.cookie.get('id'))
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
        this.storageService.local.delete('idPost');
        this.storageService.local.set('idPost', res.data);
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
      });
  }

  myForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    preview: new FormControl('', [Validators.required]),
    editorContent: new FormControl(
      { value: '', disabled: false },
      Validators.required
    ),
  });

  get fc() {
    return this.myForm.controls;
  }

  onMainFileSelect(event: any) {
    this.avatar = event.target.files;
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.mainImage = event.target.result;
      };
    }
  }

  onFileSelect(event: any) {
    const idParent = this.storageService.local.get('idPost') as string;
    if (event.target.files.length > 0) {
      for (let img of event.target.files) {
        const formData = new FormData();
        formData.append('media', img);
        formData.append('idParent', idParent);
        formData.append('type', 'post');

        this.mainService.media
          .upload(formData)
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
            this.uploadedImages.push(res.data);
          });
      }
      this.toastr.success('Upload images successfully!', '', {
        timeOut: 2000,
      });
    }
  }

  removeImage(img: any) {
    this.mainService.media
      .delete(img._id)
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
        this.uploadedImages = this.uploadedImages.filter(
          (img) => img._id !== res.data._id
        );
      });
  }

  submit() {
    this.isSubmitted = true;
    if (this.myForm.invalid) return;
    if (!this.mainImage) return;

    const formData = new FormData();
    formData.append('title', this.myForm.value.title as string);
    formData.append('preview', this.myForm.value.preview as string);
    formData.append('content', this.myForm.value.editorContent as string);
    formData.append('media', this.avatar[0]);

    this.mainService.post
      .updatePost(formData)
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
        this.reset();
        this.storageService.local.delete('idPost');
        this.router.navigate(['news']);
      });
  }

  reset() {
    this.myForm.reset();
    this.mainImage = null;
    this.isSubmitted = false;
  }

  clickCopyUrl() {
    this.toastr.success('Copied url to clipboard!', '', {
      timeOut: 2000,
    });
  }
}
