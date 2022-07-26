import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './components/contacts/contacts.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ThanksPageComponent } from './components/thanks-page/thanks-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'thanks', component: ThanksPageComponent },
  { path: 'contacts', component: ContactsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
