import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Back/body/body.component';
import { LandingComponent } from './Front/landing/landing.component';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { PlaceOrderComponent } from './Front/place-order/place-order.component';
import { LoginComponent } from './Front/login/login.component';
import { OrderFormComponent } from './Front/order-form/order-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },    
  {path: 'home', component: LandingComponent }, 
  {path: 'login', component: LoginComponent }, 
  {path: 'dash', component: BodyComponent },   
  { path: 'portfolio', component: PortfolioComponent},
  {path: 'holding', component: HoldingComponent},  
  {path: 'form', component: OrderFormComponent},
  {path: 'transaction', component: TransactionComponent}, 
  {path: 'order', component: PlaceOrderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
