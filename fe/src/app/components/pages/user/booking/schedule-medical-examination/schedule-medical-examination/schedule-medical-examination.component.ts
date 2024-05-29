import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-schedule-medical-examination',
  templateUrl: './schedule-medical-examination.component.html',
  styleUrls: ['./schedule-medical-examination.component.scss']
})
export class ScheduleMedicalExaminationComponent {
  formSubmit!: FormGroup;
  isSubmitted = false;
  type: string = "male";
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private toastr: ToastrService) {
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY'
    };
  }

  ngOnInit(): void {
    this.formSubmit = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      reason: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]]
    })
  }

  get fcSubmit() {
    return this.formSubmit.controls;
  }

  onChange(value: any) {
    this.type = value.target.value;
  }

  clearForm() {
    this.formSubmit.reset();
  }

  Submit() {
    this.isSubmitted = true;
    if (this.formSubmit.invalid) return;
    console.log(this.fcSubmit['email'].value);
    console.log(this.fcSubmit['name'].value);
    console.log(this.fcSubmit['address'].value);
    console.log(this.fcSubmit['phone'].value);
    console.log(this.fcSubmit['reason'].value);
    console.log(this.fcSubmit['dateOfBirth'].value);
    console.log(this.type);
  }
}