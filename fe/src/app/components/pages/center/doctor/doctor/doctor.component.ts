import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { Editor, Toolbar } from 'ngx-editor';
import { MDoctor, MGetAllDoctors } from 'src/app/shared/models/doctor';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@UntilDestroy()
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DoctorComponent implements OnInit, OnDestroy {
  bsConfig: Partial<BsDatepickerConfig>;
  // editor
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

  editorForm = new FormGroup({
    editorContent: new FormControl(
      { value: '', disabled: false },
      Validators.required
    ),
  });

  get doc(): AbstractControl {
    return this.editorForm.get('editorContent') as AbstractControl;
  }

  ////////////////

  isSubmitted = false;
  gender: string = 'male';
  active: string = 'active';
  selectedGender: string = '';
  listDoctors!: MGetAllDoctors;
  selectActive: string = '';
  searchString: string = '';
  placeholderSearch: string = 'Name...';
  total!: number;
  page: number = 1;
  checkNull: boolean = false;
  btnEdit: boolean = false;
  titles = [
    'stt',
    'name',
    'email',
    'addres',
    'phone number',
    'medical specialties',
    'active',
    '',
  ];

  //
  id: string = '';
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  address: string = '';
  nationality: string = '';
  dateOfBirth!: Date;
  joiningDate!: Date;
  graduationDate!: Date;
  university!: string;

  constructor(
    private mainService: MainService,
    private storageService: StorageService,
    private toastr: ToastrService
  ) {
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY',
    };
  }

  setValue(
    gender: string,
    degree: string,
    academic: string,
    specialties: string
  ) {
    this.form.get('selectGender')?.setValue(gender);
    this.form.get('selectDegree')?.setValue(degree);
    this.form.get('selectAcademic')?.setValue(academic);
    this.form.get('selectSpecialties')?.setValue(specialties);
  }

  ngOnInit(): void {
    this.getAllDoctors(1, 10, '', '');
    this.editor = new Editor();
    this.btnEdit = false;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateOfBirth: new FormControl('', [Validators.required]),
    graduationDate: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    address: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    joiningDate: new FormControl(''),
    university: new FormControl('', [Validators.required]),
    selectGender: new FormControl('', [Validators.required]),
    selectDegree: new FormControl('', [Validators.required]),
    selectAcademic: new FormControl(''),
    selectSpecialties: new FormControl('', [Validators.required]),
  });

  get fc() {
    return this.form.controls;
  }

  onChangeActive(value: any) {
    this.active = value.target.value;
  }

  onValueChange(value: string) {
    this.searchString = value;
  }

  CreateNewEmployee() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    this.mainService.doctor
      .createNewDoctor({
        centerId: this.storageService.cookie.get('id'),
        name: this.form.value.name as string,
        email: this.form.value.email as string,
        dateOfBirth: this.form.value.dateOfBirth
          ? new Date(this.form.value.dateOfBirth)
          : undefined,
        graduationDate: this.form.value.graduationDate
          ? new Date(this.form.value.graduationDate)
          : undefined,
        phoneNumber: this.form.value.phoneNumber as string,
        address: this.form.value.address as string,
        nationality: this.form.value.nationality as string,
        joiningDate: this.form.value.joiningDate
          ? new Date(this.form.value.joiningDate)
          : undefined,
        university: this.form.value.university as string,
        gender: this.fc.selectGender.value as string,
        degree: this.fc.selectDegree.value as string,
        academic: this.fc.selectAcademic.value as string,
        specialties: this.form.value.selectSpecialties as string,
        active: this.active,
        describe: this.doc.value,
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
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
        this.getAllDoctors(1, 10, '', '');
        this.active = 'active';
        this.doc.setValue('');
        this.isSubmitted = false;
      });
  }

  getAllDoctors(
    page: number,
    size: number,
    active: string,
    searchString: string
  ) {
    this.mainService.doctor
      .getAllDoctors({
        page: page,
        size: size,
        active: active,
        searchString: searchString,
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
        if (res.data.length < 1) this.checkNull = true;
        this.listDoctors = res;
        this.total = res.total;
      });
    this.checkNull = false;
    this.form.reset();
    this.setValue('', '', '', '');
  }

  onSelected(selectedPage: number) {
    this.page = selectedPage;
    this.getAllDoctors(selectedPage, 10, this.selectActive, this.searchString);
  }

  onDoctorSelected(item: MDoctor) {
    this.isSubmitted = false;
    this.id = item._id;
    this.active = item.active;
    this.name = item.name;
    this.email = item.email;
    this.dateOfBirth = new Date(item.dateOfBirth);
    this.phoneNumber = item.phoneNumber;
    this.address = item.address;
    this.nationality = item.nationality;
    this.joiningDate = new Date(item.joiningDate);
    this.graduationDate = new Date(item.graduationDate);
    this.university = item.university;
    this.setValue(item.gender, item.degree, item.academic, item.specialties);
    this.doc.setValue(item.describe);
    this.btnEdit = true;
  }

  EditInforDoctor() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    this.mainService.doctor
      .editInforDoctor({
        id: this.id,
        name: this.form.value.name as string,
        email: this.form.value.email as string,
        dateOfBirth: this.form.value.dateOfBirth
          ? new Date(this.form.value.dateOfBirth)
          : undefined,
        graduationDate: this.form.value.graduationDate
          ? new Date(this.form.value.graduationDate)
          : undefined,
        phoneNumber: this.form.value.phoneNumber as string,
        address: this.form.value.address as string,
        nationality: this.form.value.nationality as string,
        joiningDate: this.form.value.joiningDate
          ? new Date(this.form.value.joiningDate)
          : undefined,
        university: this.form.value.university as string,
        gender: this.fc.selectGender.value as string,
        degree: this.fc.selectDegree.value as string,
        academic: this.fc.selectAcademic.value as string,
        specialties: this.form.value.selectSpecialties as string,
        active: this.active,
        describe: this.doc.value,
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
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
        this.getAllDoctors(1, 10, '', '');
        this.form.reset();
        this.doc.setValue('');
        this.active = 'active';
        this.isSubmitted = false;
        this.btnEdit = false;
      });
  }

  Cancel() {
    this.btnEdit = false;
    this.form.reset();
    this.doc.setValue('');
    this.active = 'active';
  }

  onDoctorDelete(data: boolean) {
    if (data === true) {
      this.getAllDoctors(1, 10, '', '');
    }
  }

  filter() {
    this.getAllDoctors(1, 10, this.selectActive, this.searchString);
  }

  resetFilter() {
    this.getAllDoctors(1, 10, '', '');
    this.searchString = '';
    this.selectActive = '';
  }
}
