import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-reviews',
  templateUrl: './service-reviews.component.html',
  styleUrls: ['./service-reviews.component.scss']
})
export class ServiceReviewsComponent {
  max = 5;
  rate = 5;
  overStar: number | undefined;
  percent = '';
  myGroup!: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.myGroup = this.formBuilder.group({
      review: ['', [Validators.required]],
    })
  }


  get fc() {
    return this.myGroup.controls;
  }

  hoveringOver(value: number): void {
    this.overStar = value;
    this.percent = this.calculatePercent(value);
  }

  private calculatePercent(value: number): string {
    const temp = (value / this.max) * 100;
    switch (temp) {
      case 20: return 'Very bad';
      case 40: return 'Poor';
      case 60: return 'OK';
      case 80: return 'Good';
      default: return 'Excellent';
    }
  }

  Submit() {
    this.isSubmitted = true;

    console.log(this.rate);
    console.log(this.fc['review'].value);

  }
}
