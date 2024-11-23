import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Back/body/body.component';
import { LandingComponent } from './Front/landing/landing.component';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { WatchlistComponent } from './Front/watchlist/watchlist.component';
import { LoginComponent } from './Front/login/login.component';
import { OrderFormComponent } from './Front/order-form/order-form.component';
import { FinancialNewsComponent } from './Front/financial-news/financial-news.component';
import { OptionQuoteComponent } from './Front/option-quote/option-quote.component';
import { OilPricesQuoteComponent } from './Front/oil-prices-quote/oil-prices-quote.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },    
  {path: 'home', component: LandingComponent }, 
  {path: 'login', component: LoginComponent }, 
  {path: 'dash', component: BodyComponent },   
  {path: 'portfolio', component: PortfolioComponent}, 
  {path: 'form/:portfolioId', component: OrderFormComponent},
  {path: 'holding', component: HoldingComponent},  
  {path: 'transaction', component: TransactionComponent}, 
  //{path: 'order', component: WatchlistComponent},  
  {path: 'news', component: FinancialNewsComponent}, 
  {path: 'option', component: OptionQuoteComponent}, 
  {path: 'oil', component: OilPricesQuoteComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
