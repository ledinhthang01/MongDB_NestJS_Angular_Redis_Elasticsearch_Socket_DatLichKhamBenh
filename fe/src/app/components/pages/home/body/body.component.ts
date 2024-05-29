import { Component, HostListener, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MLatestPost } from 'src/app/shared/models/post';

@UntilDestroy()
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent implements OnInit {
  itemsPerSlide = 3;
  screenWidth!: number;
  data!: MLatestPost;

  dataSpecialist = [
    {
      name: 'Orthopedic',
      img: '../../../../assets/Data/xuongkhop.png',
    },
    {
      name: 'Neurology',
      img: '../../../../assets/Data/thankinh.png',
    },
    {
      name: 'Gastroenterology',
      img: '../../../../assets/Data/tieuhoa.png',
    },
  ];

  dataCenter = [
    {
      name: 'Viet Duc Friendship Hospital',
      img: '../../../../assets/Data/bv1.jpg',
    },
    {
      name: 'Cho Ray Hospital',
      img: '../../../../assets/Data/bv2.jpg',
    },
    {
      name: 'An Viet Hospital',
      img: '../../../../assets/Data/bv3.jpg',
    },
  ];

  dataDoctor = [
    {
      name: 'Doctor: Do Anh Vu',
      img: '../../../../assets/Data/bs1.png',
    },
    {
      name: 'Doctor: Nguyen Van Ly',
      img: '../../../../assets/Data/bs2.jpg',
    },
    {
      name: 'Doctor: Le Quoc Tu',
      img: '../../../../assets/Data/bs3.jpg',
    },
  ];

  dataNews = [
    {
      title: '4 warning signs that your baby has squint',
      preview:
        'How to recognize the signs of squint in your baby? What do parents need to pay attention to in caring for and monitoring vision complications for their children? Read more in the following article!',
      img: '../../../../assets/Data/news2.jpg',
    },
    {
      title: 'Read now: 5 common ways to treat squint eyes',
      preview:
        'How to treat squint eyes is something that many people are interested in today. So what are the commonly used strabismus treatment methods today? Read now in the article!',
      img: '../../../../assets/Data/news3.jpg',
    },
    {
      title: 'Neonatal jaundice: Causes and interventions',
      preview:
        'Neonatal jaundice is caused by a substance called bilirubin (made in the body) being elevated in the blood and manifested by yellow discoloration of the skin and eyes. At mild levels, jaundice goes away on its own, or at more severe levels, children need phototherapy or blood exchange when bilirubin levels continue to increase.',
      img: '../../../../assets/Data/news4.png',
    },
    {
      title: 'Dyslipidemia: symptoms, causes and treatments',
      preview:
        "If lipid disorders are not detected early and treated properly, they can lead to many diseases related to atherosclerosis such as angina, myocardial infarction, stroke, and lower limb artery disease. ,... Let's learn details about lipid disorders and appropriate care in the article below from BookingCare.",
      img: '../../../../assets/Data/news5.png',
    },
  ];

  constructor(private mainService: MainService, private toastr: ToastrService) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getLatestPost();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  getLatestPost() {
    this.mainService.post
      .getlatestPost()
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
      });
  }
}
