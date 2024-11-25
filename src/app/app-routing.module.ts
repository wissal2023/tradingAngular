import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Back/body/body.component';
import { LandingComponent } from './Front/landing/landing.component';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { PlaceOrderComponent } from './Front/place-order/place-order.component';
import { LoginComponent } from './login/login.component';
import { BacktestingFormComponent } from './backtesting-form/backtesting-form.component';

import { BacktestingResultComponent } from './backtesting-result/backtesting-result.component';
import { StrategyOptimizerComponent } from './strategy-optimizer/strategy-optimizer.component';
import { AuthGuard } from './Services/auth.guard';
import { PredictionComponent } from './prediction/prediction.component';
import { AdvancedBacktestingComponent } from './advanced-backtesting/advanced-backtesting.component';
import { StrategyResultsComponent } from './strategy-results/strategy-results.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizSummaryComponent } from './quiz-summary/quiz-summary.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'predict', component: PredictionComponent },
    { path: 'login', component: LoginComponent },
    { path: 'quizzes', component: QuizListComponent },
    { path: 'quiz/:id', component: QuizComponent },
      { path: 'quiz-summary', component: QuizSummaryComponent },
    { path: 'advancebacktest', component: AdvancedBacktestingComponent },
    { path: 'optim', component: StrategyOptimizerComponent,
      canActivate: [AuthGuard] },
      { path: 'strategy-results', component: StrategyResultsComponent,
        canActivate: [AuthGuard] },
    { 
      path: 'backtest-form', 
      component: BacktestingFormComponent
    },
    { 
      path: 'backtest-results', 
      component: BacktestingResultComponent
    },
    {path: 'dash', component: BodyComponent }, 
    {path: 'home', component: LandingComponent }, 
    {path: 'holding', component: HoldingComponent},
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
