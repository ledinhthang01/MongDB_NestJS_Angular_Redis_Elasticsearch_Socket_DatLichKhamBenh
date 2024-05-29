import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/services/user/main.service';
import { MEmployee, MGetAllEmployees } from 'src/app/shared/models/employee';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, of } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@UntilDestroy()
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent {
  bsConfig: Partial<BsDatepickerConfig>;
  isSubmitted = false;
  gender: string = 'male';
  active: string = 'active';
  listEmployee!: MGetAllEmployees;
  selectGender: string = '';
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
    'gender',
    'phone number',
    'nationality',
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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private mainService: MainService,
    private toastr: ToastrService
  ) {
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY',
    };
  }

  ngOnInit(): void {
    this.getAllEmployees(1, 10, '', '', '');
    this.btnEdit = false;
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateOfBirth: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    address: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    joiningDate: new FormControl(''),
  });

  get fc() {
    return this.form.controls;
  }

  onChangeGender(value: any) {
    this.gender = value.target.value;
  }

  onChangeActive(value: any) {
    this.active = value.target.value;
  }

  onValueChange(value: string) {
    this.searchString = value;
  }

  reset() {
    this.gender = 'male';
    this.active = 'active';
  }

  CreateNewEmployee() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    this.mainService.admin
      .CreateNewEmployee({
        name: this.form.value.name as string,
        email: this.form.value.email as string,
        gender: this.gender,
        dateOfBirth: this.form.value.dateOfBirth
          ? new Date(this.form.value.dateOfBirth)
          : undefined,
        phoneNumber: this.form.value.phoneNumber as string,
        address: this.form.value.address as string,
        nationality: this.form.value.nationality as string,
        joiningDate: this.form.value.joiningDate
          ? new Date(this.form.value.joiningDate)
          : undefined,
        active: this.active,
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
        this.getAllEmployees(1, 10, '', '', '');
        this.reset();
        this.form.reset();
        this.isSubmitted = false;
      });
  }

  getAllEmployees(
    page: number,
    size: number,
    gender: string,
    active: string,
    searchString: string
  ) {
    this.mainService.admin
      .getAllEmployees({
        page: page,
        size: size,
        gender: gender,
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
        this.listEmployee = res;
        this.total = res.total;
      });
    this.checkNull = false;
  }

  onSelected(selectedPage: number) {
    this.page = selectedPage;
    this.getAllEmployees(
      selectedPage,
      10,
      this.selectGender,
      this.selectActive,
      this.searchString
    );
  }

  onEmployeeSelected(item: MEmployee) {
    this.isSubmitted = false;
    this.id = item._id;
    this.gender = item.gender;
    this.active = item.active;
    this.name = item.name;
    this.email = item.email;
    this.dateOfBirth = new Date(item.dateOfBirth);
    this.phoneNumber = item.phoneNumber;
    this.address = item.address;
    this.nationality = item.nationality;
    this.joiningDate = new Date(item.joiningDate);
    this.btnEdit = true;
  }

  EditInforEmployee() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.mainService.admin
      .EditInforEmployee({
        id: this.id,
        name: this.form.value.name as string,
        email: this.form.value.email as string,
        gender: this.gender,
        dateOfBirth: this.form.value.dateOfBirth
          ? new Date(this.form.value.dateOfBirth)
          : undefined,
        phoneNumber: this.form.value.phoneNumber as string,
        address: this.form.value.address as string,
        nationality: this.form.value.nationality as string,
        joiningDate: this.form.value.joiningDate
          ? new Date(this.form.value.joiningDate)
          : undefined,
        active: this.active,
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
        this.getAllEmployees(1, 10, '', '', '');
        this.reset();
        this.form.reset();
        this.isSubmitted = false;
        this.btnEdit = false;
      });
  }

  Cancel() {
    this.btnEdit = false;
    this.form.reset();
    this.reset();
    this.gender = 'male';
    this.active = 'active';
  }

  onEmployeeDelete(data: boolean) {
    if (data === true) {
      this.getAllEmployees(1, 10, '', '', '');
    }
  }

  filter() {
    this.getAllEmployees(
      1,
      10,
      this.selectGender,
      this.selectActive,
      this.searchString
    );
  }

  resetFilter() {
    this.getAllEmployees(1, 10, '', '', '');
    this.searchString = '';
    this.selectGender = '';
    this.selectActive = '';
  }
}
