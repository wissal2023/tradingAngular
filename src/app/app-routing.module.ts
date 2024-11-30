import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './Back/body/body.component';
import { LandingComponent } from './Front/landing/landing.component';
import { PortfolioComponent } from './Front/PortfolioComponent/portfolio/portfolio.component';
import { HoldingComponent } from './Front/PortfolioComponent/holding/holding.component';
import { TransactionComponent } from './Front/ChallengeComponent/transaction/transaction.component';
import { ChallengeComponent } from './Front/ChallengeComponent/challenge/challenge.component';
import { TransactionchallengeComponent } from './Front/ChallengeComponent/Transactionn/transactionchallenge.component';
import { CreateChallengeComponent } from './Back/create-challenge/create-challenge/create-challenge.component';
import { WatchlistComponent } from './Front/PortfolioComponent/watchlist/watchlist.component';
import { ListUsersComponent } from './Back/list-users/list-users.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { ActivateAccountComponent } from './Front/UserComponent/activate-account/activate-account.component';
import { FinancialNewsComponent } from './Front/PortfolioComponent/financial-news/financial-news.component';
import { OptionQuoteComponent } from './Front/PortfolioComponent/option-quote/option-quote.component';
import { OilPricesQuoteComponent } from './Front/PortfolioComponent/oil-prices-quote/oil-prices-quote.component';
import { ShowTransactionsComponent } from './Front/PortfolioComponent/show-transactions/show-transactions.component';
import { StrategyOptimizerComponent } from './Front/BacktestComponent/strategy-optimizer/strategy-optimizer.component';
import { PredictionComponent } from './Front/BacktestComponent/prediction/prediction.component';
import { StrategyResultsComponent } from './Front/BacktestComponent/strategy-results/strategy-results.component';
import { QuizComponent } from './Front/BacktestComponent/quiz/quiz.component';
import { QuizSummaryComponent } from './Front/BacktestComponent/quiz-summary/quiz-summary.component';
import { OrderFormComponent } from './Front/PortfolioComponent/order-form/order-form.component';
import { NotAuthorizedComponent } from './Front/UserComponent/not-authorized/not-authorized.component';
import { ResetPasswordComponent } from './Front/UserComponent/reset-password/reset-password.component';
import { RegisterComponent } from './Front/UserComponent/register/register.component';
import { LoginComponent } from './Front/UserComponent/login/login.component';
import { BacktestingResultComponent } from './Front/BacktestComponent/backtesting-result/backtesting-result.component';
import { BacktestingFormComponent } from './Front/BacktestComponent/backtesting-form/backtesting-form.component';
import { QuizListComponent } from './Front/BacktestComponent/quiz-list/quiz-list.component';
import { AdvancedBacktestingComponent } from './Front/BacktestComponent/advanced-backtesting/advanced-backtesting.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },    
  { path: 'home', component: LandingComponent }, 
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-pwd', component: ResetPasswordComponent },  
  { path: 'activate-account', component: ActivateAccountComponent }, 
  { path: 'dash', component: BodyComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'list-user', component: ListUsersComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' } },
  
  { path: 'portfolio/:userId/:portfolioId', component: PortfolioComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'CUSTOMER' } },
  { path: 'form/:portfolioId', component: OrderFormComponent },
  { path: 'holding/:portfolioId', component: HoldingComponent },
  { path: 'news', component: FinancialNewsComponent }, 
  { path: 'option', component: OptionQuoteComponent }, 
  { path: 'oil', component: OilPricesQuoteComponent },
  { path: 'transactions/:portfolioId', component: ShowTransactionsComponent },
  { path: 'watchlist', component: WatchlistComponent },

  { path: 'challenge', component: ChallengeComponent },
  { path: 'Transaction', component: TransactionchallengeComponent },
  { path: 'transaction', component: TransactionComponent }, 
  { path: 'Transactions', component: TransactionchallengeComponent },
  { path: 'Transactions/:challengeId', component: TransactionchallengeComponent },
  { path: 'createchallenge', component: CreateChallengeComponent },

  { path: 'predict', component: PredictionComponent },
  { path: 'quizzes', component: QuizListComponent },
  { path: 'quiz/:id', component: QuizComponent },
  { path: 'quiz-summary', component: QuizSummaryComponent },
  { path: 'advancebacktest', component: AdvancedBacktestingComponent },
  { path: 'optim', component: StrategyOptimizerComponent, canActivate: [AuthGuard] },
  { path: 'strategy-results', component: StrategyResultsComponent, canActivate: [AuthGuard] },
  { path: 'backtest-form', component: BacktestingFormComponent },
  { path: 'backtest-results', component: BacktestingResultComponent },  

  { path: 'not-authorized', component: NotAuthorizedComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

