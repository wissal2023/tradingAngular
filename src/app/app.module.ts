
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';  
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { NbAccordionModule, NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbToggleModule, NbTreeGridModule } from '@nebular/theme';
import { BarElement, CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { MatTabsModule } from '@angular/material/tabs';

import { BodyComponent } from './Back/body/body.component';
import { FooterComponent } from './Back/footer/footer.component';
import { NavComponent } from './Back/nav/nav.component';
import { SidebarComponent } from './Back/sidebar/sidebar.component';
import { LandingComponent } from './Front/landing/landing.component';
import { FooterFrontComponent } from './Front/footer-Front/footerFront.component';
import { HeaderComponent } from './Front/header/header.component';

import { TransactionComponent } from './Front/ChallengeComponent/transaction/transaction.component';
import { LoginComponent } from './Front/UserComponent/login/login.component';
import { StrategyOptimizerComponent } from './Front/BacktestComponent/strategy-optimizer/strategy-optimizer.component';
import { StockPreviewComponent } from './Front/BacktestComponent/stock-preview/stock-preview.component';
import { PredictionComponent } from './Front/BacktestComponent/prediction/prediction.component';
import { TooltipDirective } from './tooltip.directive';
import { WalkForwardComponent } from './Front/BacktestComponent/walk-forward/walk-forward.component';
import { MonteCarloComponent } from './Front/BacktestComponent/monte-carlo/monte-carlo.component';
import { StressTestComponent } from './Front/BacktestComponent/stress-test/stress-test.component';
import { StrategyResultsComponent } from './Front/BacktestComponent/strategy-results/strategy-results.component';
import { QuizComponent } from './Front/BacktestComponent/quiz/quiz.component';
import { QuizSummaryComponent } from './Front/BacktestComponent/quiz-summary/quiz-summary.component';
import { ChallengeComponent } from './Front/ChallengeComponent/challenge/challenge.component';
import { TraderComponent } from './Front/BacktestComponent/trader/trader.component';
import { CreateChallengeComponent } from './Back/create-challenge/create-challenge/create-challenge.component';
import { TransactionchallengeComponent } from './Front/ChallengeComponent/Transactionn/transactionchallenge.component';
import { ListPortfolioComponent } from './Back/list-portfolio/list-portfolio.component';
import { ListOrdersComponent } from './Back/list-orders/list-orders.component';
import { RegisterComponent } from './Front/UserComponent/register/register.component';
import { ListUsersComponent } from './Back/list-users/list-users.component';
import { UserProfileComponent } from './Back/user-profile/user-profile.component';
import { SearchfilterPipe } from './Pipes/searchFilter.pipe';
import { UserDetailsComponent } from './Back/user-details/user-details.component';
import { ResetPasswordComponent } from './Front/UserComponent/reset-password/reset-password.component';
import { NotAuthorizedComponent } from './Front/UserComponent/not-authorized/not-authorized.component';
import { ActivateAccountComponent } from './Front/UserComponent/activate-account/activate-account.component';
import { ListTransactionComponent } from './Back/list-transaction/list-transaction.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PortfolioComponent } from './Front/PortfolioComponent/portfolio/portfolio.component';
import { StockQuoteComponent } from './Front/PortfolioComponent/stock-quote/stock-quote.component';
import { HoldingComponent } from './Front/PortfolioComponent/holding/holding.component';
import { WatchlistComponent } from './Front/PortfolioComponent/watchlist/watchlist.component';
import { ChartComponent } from './Front/PortfolioComponent/chart/chart.component';
import { OrderFormComponent } from './Front/PortfolioComponent/order-form/order-form.component';
import { ModalComponent } from './Front/PortfolioComponent/modal/modal.component';
import { FinancialNewsComponent } from './Front/PortfolioComponent/financial-news/financial-news.component';
import { ListorderComponent } from './Front/PortfolioComponent/listorder/listorder.component';
import { OptionQuoteComponent } from './Front/PortfolioComponent/option-quote/option-quote.component';
import { OilPricesQuoteComponent } from './Front/PortfolioComponent/oil-prices-quote/oil-prices-quote.component';
import { PerformanceChartComponent } from './Front/PortfolioComponent/performance-chart/performance-chart.component';
import { ShowTransactionsComponent } from './Front/PortfolioComponent/show-transactions/show-transactions.component';
import { BacktestingFormComponent } from './Front/BacktestComponent/backtesting-form/backtesting-form.component';
import { AdvancedBacktestingComponent } from './Front/BacktestComponent/advanced-backtesting/advanced-backtesting.component';
import { CompareStrategiesComponent } from './Front/BacktestComponent/compare-strategies/compare-strategies.component';
import { QuizListComponent } from './Front/BacktestComponent/quiz-list/quiz-list.component';
import { BacktestingResultComponent } from './Front/BacktestComponent/backtesting-result/backtesting-result.component';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

@NgModule({
  declarations: [
  AppComponent,
  BodyComponent,
  FooterComponent,
  NavComponent,
  SidebarComponent,
  LandingComponent,
  FooterFrontComponent,  
  HeaderComponent,  
  PortfolioComponent,  
  StockQuoteComponent,  
  HoldingComponent,  
  TransactionComponent,
  LoginComponent,  
  BacktestingResultComponent,  
  BacktestingFormComponent,  
  StrategyOptimizerComponent,
  StockPreviewComponent,  
  PredictionComponent,  
  TooltipDirective,  
  AdvancedBacktestingComponent,
  CompareStrategiesComponent,  
  WalkForwardComponent,  
  MonteCarloComponent,  
  StressTestComponent,
  StrategyResultsComponent,  
  QuizListComponent,  
  QuizComponent,  
  QuizSummaryComponent,  
  ChallengeComponent,
  TraderComponent,  
  CreateChallengeComponent,
  TransactionchallengeComponent,
  WatchlistComponent,  
  ChartComponent,  
  OrderFormComponent,  
  ListPortfolioComponent,  
  ListOrdersComponent,  
  RegisterComponent,  
  ListUsersComponent,  
  UserProfileComponent,  
  SearchfilterPipe,
  UserDetailsComponent,  
  ResetPasswordComponent,  
  NotAuthorizedComponent,  
  ActivateAccountComponent,
  ListTransactionComponent,  
  ModalComponent,  
  FinancialNewsComponent,  
  ListorderComponent,
  OptionQuoteComponent, 
  OilPricesQuoteComponent,  
  BodyComponent,  
  PerformanceChartComponent,  
  ShowTransactionsComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbCardModule,
    NbAlertModule,
    NbIconModule,
    NbBadgeModule,
    NbTreeGridModule,
    NbAccordionModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbToggleModule,
    NbToastrModule.forRoot(),
    NbTabsetModule,
    NbListModule,
    NbDatepickerModule.forRoot(),
    NgChartsModule,
  ],
  
  
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

