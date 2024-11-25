import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Back/body/body.component';
import { LandingComponent } from './Front/landing/landing.component';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { PlaceOrderComponent } from './Front/place-order/place-order.component';
import { ChallengeComponent } from './Front/challenge/challenge.component';
import { TransactionchallengeComponent } from './Front/Transactionn/transactionchallenge.component';
import { CreateChallengeComponent } from './Back/create-challenge/create-challenge/create-challenge.component';
const routes: Routes = [
    { path: '', redirectTo: 'challenge', pathMatch: 'full' },
    {path: 'dash', component: BodyComponent }, 
    {path: 'home', component: LandingComponent }, 
    {path: 'holding', component: HoldingComponent},
    {path: 'challenge', component: ChallengeComponent},
    {path: 'Transaction', component: TransactionchallengeComponent},
    {path: 'Transactions', component: TransactionchallengeComponent},
    {path:'Transactions/:challengeId', component: TransactionchallengeComponent},
    {path: 'createchallenge', component: CreateChallengeComponent},
    { path: 'portfolio', component: PortfolioComponent, children: [
      {path: 'transaction', component: TransactionComponent},      
      {path: 'order', component: PlaceOrderComponent}]
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
