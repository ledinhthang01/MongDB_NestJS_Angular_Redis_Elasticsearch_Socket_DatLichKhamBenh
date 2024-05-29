import { Component, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MCenter, MGetAllCenters } from 'src/app/shared/models/center';

@UntilDestroy()
@Component({
  selector: 'app-crudcenter',
  templateUrl: './crudcenter.component.html',
  styleUrls: ['./crudcenter.component.scss']
})
export class CRUDCenterComponent {
  bsConfig: Partial<BsDatepickerConfig>;
  isSubmitted = false;
  active: string = "active";
  listCenter!: MGetAllCenters;
  selectActive: string = '';
  searchString: string = '';
  placeholderSearch: string = "Name...";
  total!: number;
  page: number = 1;
  checkNull: boolean = false;
  btnEdit: boolean = false;
  titles = ['stt', 'name', 'email', 'address', 'phone number', 'nationality', 'active', '']

  // 
  id: string = '';
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  address: string = '';
  nationality: string = '';
  joiningDate!: Date;


  constructor(private router: Router,
    private mainService: MainService,
    private toastr: ToastrService) {
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY'
    };
  }

  ngOnInit(): void {
    this.getAllCenters(1, 10, "", "");
    this.btnEdit = false;
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    address: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    joiningDate: new FormControl(),
  })

  get fc() {
    return this.form.controls;
  }

  onChangeActive(value: any) {
    this.active = value.target.value;
  }

  onValueChange(value: string) {
    this.searchString = value;
  }

  CreateNewCenter() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    this.mainService.admin.createNewCenter({
      name: this.form.value.name as string,
      email: this.form.value.email as string,
      phoneNumber: this.form.value.phoneNumber as string,
      address: this.form.value.address as string,
      nationality: this.form.value.nationality as string,
      joiningDate: this.form.value.joiningDate ? new Date(this.form.value.joiningDate) : undefined,
      active: this.active,
    }).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        })
        return of(null)
      })
    ).subscribe((res: any) => {
      this.toastr.success(res.message, "", {
        timeOut: 2000,
      })
      this.getAllCenters(1, 10, "", "");
      this.active = 'active';
      this.form.reset();
      this.isSubmitted = false;
    })
  }

  getAllCenters(page: number, size: number, active: string, searchString: string) {
    this.mainService.admin.getAllCenters({
      page: page,
      size: size,
      active: active,
      searchString: searchString
    }).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        });
        return of(null);
      })
    ).subscribe((res: any) => {
      if (res.data.length < 1) this.checkNull = true;
      this.listCenter = res;
      this.total = res.total;
    })
    this.checkNull = false;
  }

  onSelected(selectedPage: number) {
    this.page = selectedPage;
    this.getAllCenters(selectedPage, 10, this.selectActive, this.searchString);
  }

  onCenterSelected(item: MCenter) {
    this.isSubmitted = false;
    this.id = item._id;
    this.active = item.active;
    this.name = item.name;
    this.email = item.email;
    this.phoneNumber = item.phoneNumber;
    this.address = item.address;
    this.nationality = item.nationality;
    this.joiningDate = new Date(item.joiningDate);
    this.btnEdit = true;
  }

  EditInforCenter() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.mainService.admin.editInforCenter({
      id: this.id,
      name: this.form.value.name as string,
      email: this.form.value.email as string,
      phoneNumber: this.form.value.phoneNumber as string,
      address: this.form.value.address as string,
      nationality: this.form.value.nationality as string,
      joiningDate: this.form.value.joiningDate ? new Date(this.form.value.joiningDate) : undefined,
      active: this.active,
    }).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        });
        return of(null);
      })
    ).subscribe((res: any) => {
      this.toastr.success(res.message, "", {
        timeOut: 2000,
      })
      this.getAllCenters(1, 10, "", "");
      this.active = 'active';
      this.form.reset();
      this.isSubmitted = false;
      this.btnEdit = false;
    })
  }

  Cancel() {
    this.btnEdit = false;
    this.form.reset();
    this.active = "active";
  }

  onCenterDelete(data: boolean) {
    if (data === true) {
      this.getAllCenters(1, 10, "", "");
    }
  }

  filter() {
    this.getAllCenters(1, 10, this.selectActive, this.searchString);
  }

  resetFilter() {
    this.getAllCenters(1, 10, "", "");
    this.searchString = '';
    this.selectActive = '';
  }
}
