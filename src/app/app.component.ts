import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GeneralServiceService } from './services/general-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'india-pilgrimage';
  language;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private generalService: GeneralServiceService
  ) {
    translate.setDefaultLang('ru');
  }
  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      let r = this.route;
      while (r.firstChild) {
        r = r.firstChild;
      }
      r.params.subscribe((params) => {
        this.language = params.type;
        if (this.language) {
          console.log('has language');

          this.setLanguage(this.language);
          this.generalService.currentLanguage.next(this.language)
        }
      });
    });

  }
  setLanguage(language) {
    switch (language) {
      case Languages.English:
        this.translate.setDefaultLang(Languages.English);
        break;
      case Languages.Russian:
        this.translate.setDefaultLang(Languages.Russian);
        break;
    }
  }
}
export enum Languages {
  Russian = 'ru',
  English = 'en',
}
