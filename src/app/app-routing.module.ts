import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Back/body/body.component';
import { LandingComponent } from './Front/landing/landing.component';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';

const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  {path: 'dash', component: BodyComponent }, 

  {path: 'home', component: LandingComponent }, 
  {path: 'portfolio', component: PortfolioComponent }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
