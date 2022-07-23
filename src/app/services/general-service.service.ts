import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralServiceService {
  currentLanguage: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor() { }
}
