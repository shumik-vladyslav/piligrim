import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ThanksPageComponent } from './components/thanks-page/thanks-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'thanks', component: ThanksPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
