import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { emailValidator, phoneValidator } from 'src/app/services/validation.service';
import { GeneralServiceService } from 'src/app/services/general-service.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})

export class MainPageComponent implements OnInit {
  url = "https://vosd.bitrix24.eu/rest/4/95igs0uaxwczeh83/";
  hasExpand = {};

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    let header = document.querySelector('.head_wrap')
    if (window.pageYOffset > 0) {
      header.classList.add('bg_for_header')
    } else header.classList.remove('bg_for_header')
  }
  first: number = 0;
  middle: number = 1;
  last: number = 2;
  form: FormGroup;
  routeParams;
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
      path: 'assets/Images/slide4.jpg',
    },
    {
      index: 4,
      path: 'assets/Images/slide5.jpg',
    },
    {
      index: 5,
      path: 'assets/Images/slide6.jpg',
    },
    {
      index: 6,
      path: 'assets/Images/slide7.jpg',
    },
    {
      index: 7,
      path: 'assets/Images/slide8.jpg',
    },
    {
      index: 8,
      path: 'assets/Images/slide9.jpg',
    },
    {
      index: 9,
      path: 'assets/Images/slide10.jpg',
    },
    {
      index: 10,
      path: 'assets/Images/slide11.jpg',
    },
    {
      index: 11,
      path: 'assets/Images/slide12.jpg',
    }
  ]

  next() {
    if (this.last < this.slides.length - 1) {
      this.first = this.first + 1;
      this.middle = this.middle + 1;
      this.last = this.last + 1;
    } else {
      this.first = 0;
      this.middle = 1;
      this.last = 2;
    }
  }

  previous() {
    if (this.first > 0) {
      this.first = this.first - 1;
      this.middle = this.middle - 1;
      this.last = this.last - 1;
    } else {
      this.first = this.slides.length - 3;
      this.middle = this.slides.length - 2;
      this.last = this.slides.length - 1;
    }
  }

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
      phone: new FormControl('', [Validators.required]),
    });

    generalService.currentLanguage.subscribe(res => {
      // this.language = res;
    })
  }
  selectedCountry = CountryISO["Ukraine"];
  ngOnInit(): void {
    this.http.get("https://api.ipregistry.co/?key=tryout", {}).subscribe((resp:any)=>{
      const findMe = Object.keys(CountryISO)[Object.values(CountryISO as any).indexOf(resp.location.country.code.toLowerCase())];
console.log(findMe);
      this.selectedCountry = CountryISO[findMe];
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.routeParams = params;
      // const userId = params['userId'];
      // console.log(userId);
    });
  }




  sendRegistrationData() {
    const form = this.form.value;
    console.log('sendRegistrationData');
    this.http
      .post(
        this.url + 'crm.deal.list',
        {}
      )
      .subscribe((dealListResponse: any) => {
        console.log('dealListResponse ', dealListResponse);
        let dealListTotal = dealListResponse.total;
        this.http
          .post(
            this.url + 'crm.contact.list',
            {
              filter: { "EMAIL": form.email },
              select: ["ID", "NAME", "LAST_NAME"]
            },
          )
          .subscribe((contactListResponse: any) => {
            console.log('contactListResponse ', contactListResponse);

            if (contactListResponse.result.length) {
              this.useContact(contactListResponse.result[0], dealListTotal);
            } else {
              this.addContact(dealListTotal);
            }

          });
      });
  }

  useContact(contact, dealListTotal) {
    this.addDeal(contact.ID, dealListTotal);
  }

  addContact(dealListTotal) {
    const form = this.form.value;
    this.http
      .post(
        this.url + 'crm.contact.add',
        {
          fields: {
            "NAME": form.name,
            PHONE: [{ VALUE: form.phone.e164Number, VALUE_TYPE: "WORK" }],
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
        this.addDeal(contact.result, dealListTotal);
      });
  }

  addDeal(contactId, dealListTotal) {
    this.http
      .post(
        this.url + 'crm.deal.list',
        {
          filter: { "CONTACT_ID": contactId, "SOURCE_DESCRIPTION": 'Лендинг Тур с Гуру' },
          select: ["*"]
        },
      )
      .subscribe((dealListResponse: any) => {
        console.log('dealListResponse ', dealListResponse);
        if (dealListResponse.result.length) {
          alert("Вы уже зарегестрировались")
        } else {

          this.http
            .post(
              this.url + 'crm.deal.add',
              {
                fields: {
                  TITLE: `Заявка номер ${dealListTotal + 1}`,
                  CONTACT_ID: contactId,
                  STATUS: 'NEW',
                  OPENED: 'Y',
                  HAS_PHONE: 'Y',
                  HAS_EMAIL: 'Y',
                  STATUS_ID: 'NEW',
                  STATUS_DESCRIPTION: 'Новый',
                  SOURCE_ID: 'CALL1',
                  SOURCE_DESCRIPTION: 'Лендинг Тур с Гуру',
                  SOURCE: 'Лендинг Тур с Гуру',
                  UTM_CAMPAIGN: this.routeParams?.utm_campaign,
                  UTM_MEDIUM: this.routeParams?.utm_medium,
                  UTM_SOURCE: this.routeParams?.utm_source,
                  UTM_TERM: this.routeParams?.utm_term,

                },
              }
            )
            .subscribe((res) => {
              console.log(res);
              this.router.navigateByUrl('/thanks');
            });
        }
      });
  }

  expand(idx: number) {
    this.hasExpand[idx] = !this.hasExpand[idx];
  }

  goToURl(url) {
    window.open(url);
  }

  scrollTo(id): void {
    let yOffSet;
    if (window.innerWidth < 480) {
      yOffSet = 40;
    } else if (window.innerWidth < 786) {
      yOffSet = 50;
    } else if (window.innerWidth < 951) {
      yOffSet = 75;
    } else if (window.innerWidth < 1361) {
      yOffSet = 90;
    } else {
      yOffSet = 108;
    }
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset - yOffSet;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
