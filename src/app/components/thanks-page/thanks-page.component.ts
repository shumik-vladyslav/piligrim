import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thanks-page',
  templateUrl: './thanks-page.component.html',
  styleUrls: ['./thanks-page.component.scss']
})
export class ThanksPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.loadScript();
  }

  loadScript() {
    const head = document.getElementsByTagName('head')[0];


    const script = document.createElement('script');
    script.innerHTML = `  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '467468471396339');
    fbq('track', 'Lead');`;

    head.insertBefore(script, head.firstChild);
  }

  goToURl(url) {
    window.open(url);
  }

}
