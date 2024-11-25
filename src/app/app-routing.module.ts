import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Back/body/body.component';
import { LandingComponent } from './Front/landing/landing.component';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { WatchlistComponent } from './Front/watchlist/watchlist.component';
import { LoginComponent } from './Front/login/login.component';
import { RegisterComponent } from './Front/register/register.component';
import { OrderFormComponent } from './Front/order-form/order-form.component';
import { ListUsersComponent } from './Back/list-users/list-users.component';
import { ResetPasswordComponent } from './Front/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { NotAuthorizedComponent } from './Front/not-authorized/not-authorized.component';
import { ActivateAccountComponent } from './Front/activate-account/activate-account.component';
import { FinancialNewsComponent } from './Front/financial-news/financial-news.component';
import { OptionQuoteComponent } from './Front/option-quote/option-quote.component';
import { OilPricesQuoteComponent } from './Front/oil-prices-quote/oil-prices-quote.component';
import { ShowTransactionsComponent } from './Front/show-transactions/show-transactions.component';


const routes: Routes = [
   
  { path: '', redirectTo: 'home', pathMatch: 'full' },    
  {path: 'home', component: LandingComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-pwd', component: ResetPasswordComponent },
  { path: 'dash', component: BodyComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' },},
  { path: 'list-user', component: ListUsersComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' },},
  { path: 'portfolio/:userId/:portfolioId',component: PortfolioComponent, canActivate: [AuthGuard, RoleGuard],  data: { expectedRole: 'CUSTOMER' },},
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'activate-account', component: ActivateAccountComponent }, 
  {path: 'form/:portfolioId', component: OrderFormComponent},
  { path: 'holding/:portfolioId', component: HoldingComponent },
  {path: 'transaction', component: TransactionComponent}, 
  {path: 'news', component: FinancialNewsComponent}, 
  {path: 'option', component: OptionQuoteComponent}, 
  {path: 'oil', component: OilPricesQuoteComponent},
  { path: 'transactions/:portfolioId', component: ShowTransactionsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
