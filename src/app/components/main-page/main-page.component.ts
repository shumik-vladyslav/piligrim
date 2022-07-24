import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { emailValidator, phoneValidator } from 'src/app/services/validation.service';
import { GeneralServiceService } from 'src/app/services/general-service.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})

export class MainPageComponent implements OnInit {
  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    let header = document.querySelector('.head_wrap')
    if (window.pageYOffset > 0) {
      header.classList.add('bg_for_header')
    } else header.classList.remove('bg_for_header')
  }
  first: number = 0;
  middle: number = 1;
  last: number = 2;
  slides: any = [
    {
      index: 0,
      path: 'assets/Images/slide1.png',
    },
    {
      index: 1,
      path: 'assets/Images/slide2.png',
    },
    {
      index: 2,
      path: 'assets/Images/slide3.png',
    },
    {
      index: 3,
      path: 'assets/Images/slide1.png',
    },
    {
      index: 4,
      path: 'assets/Images/slide2.png',
    },
    {
      index: 5,
      path: 'assets/Images/slide3.png',
    },
    {
      index: 6,
      path: 'assets/Images/slide1.png',
    },
    {
      index: 7,
      path: 'assets/Images/slide2.png',
    },
    {
      index: 8,
      path: 'assets/Images/slide3.png',
    }
  ]

  next() {
    console.log(this.last, this.slides.length)
    if (this.last < this.slides.length - 1) {
      this.first = this.first + 1;
      this.middle = this.middle + 1;
      this.last = this.last + 1;
      console.log(this.first, this.middle, this.last)
    }
  }

  previous() {
    if (this.first > 0) {
      this.first = this.first - 1;
      this.middle = this.middle - 1;
      this.last = this.last - 1;
      console.log(this.first, this.middle, this.last)
    }
  }
  form: FormGroup;
  routeParams;
  constructor(
    private _location: Location,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralServiceService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [emailValidator()]),
      phone: new FormControl('', [Validators.required, phoneValidator()]),
    });

    generalService.currentLanguage.subscribe(res => {
      // this.language = res;
    })
  }
  ngOnInit(): void { }

  sendRegistrationData() {
    const form = this.form.value;
    console.log('sendRegistrationData');
    this.http
      .post(
        'https://b24-ay5iam.bitrix24.eu/rest/4/cf2ndvv1z7r8ttgp/crm.lead.list',
        {}
      )
      .subscribe((res: any) => {
        console.log(res);

        let collection = res.total;
        this.http
          .post(
            'https://b24-ay5iam.bitrix24.eu/rest/4/cf2ndvv1z7r8ttgp/crm.contact.add',
            {
              fields: {
                "NAME": form.name,
                PHONE: [{ VALUE: form.phone, VALUE_TYPE: "WORK" }],
                EMAIL: [{ VALUE: form.email, VALUE_TYPE: "HOME" }],
                UTM_CAMPAIGN: this.routeParams?.utm_campaign,
                UTM_MEDIUM: this.routeParams?.utm_medium,
                UTM_SOURCE: this.routeParams?.utm_source,
                UTM_TERM: this.routeParams?.utm_term,
              },
            }
          )
          .subscribe((contact: any) => {
            console.log(contact);
            this.http
              .post(
                'https://b24-ay5iam.bitrix24.eu/rest/4/cf2ndvv1z7r8ttgp/crm.lead.add',
                {
                  fields: {
                    TITLE: `Заявка номер ${collection + 1}`,
                    CONTACT_ID: contact.result,
                    STATUS: 'NEW',
                    OPENED: 'Y',
                    HAS_PHONE: 'Y',
                    HAS_EMAIL: 'Y',
                    STATUS_ID: 'NEW',
                    STATUS_DESCRIPTION: 'Новый',
                    SOURCE_ID: 'CALL',
                    SOURCE_DESCRIPTION: 'Форум Ахимса и Гармония',
                    SOURCE: 'Форум "Ахимса и Гармония"',
                    UTM_CAMPAIGN: this.routeParams?.utm_campaign,
                    UTM_MEDIUM: this.routeParams?.utm_medium,
                    UTM_SOURCE: this.routeParams?.utm_source,
                    UTM_TERM: this.routeParams?.utm_term,

                  },
                }
              )
              .subscribe((res) => {
                console.log(res);
                // this.router.navigate['/','thanks'];
                this.router.navigateByUrl('/thanks');
              });
          });
      });
  }

  firstBlock: boolean = false;

  expand(idx: number) {
    switch (idx) {
      case 1:
        this.firstBlock = !this.firstBlock;
        break;
      case 2:
        this.firstBlock = !this.firstBlock;
        break;
      default:
        break;
    }
  }

  goToURl(url) {
    window.open(url);
  }
  scrollTo(id): void {
    console.log(id);
    let yOffset;
    if (id == 'forum-program' || id == 'div-about-forum') {
      yOffset = -150;
    } else {
      yOffset = -300;
    }

    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    // e.preventDefault();
    // const targetElement = document.getElementById(id);
    // console.log(targetElement);

    // targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
