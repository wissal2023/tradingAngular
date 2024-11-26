
import { StockQuoteComponent } from './Front/stock-quote/stock-quote.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './Back/body/body.component';
import { FooterComponent } from './Back/footer/footer.component';
import { NavComponent } from './Back/nav/nav.component';
import { SidebarComponent } from './Back/sidebar/sidebar.component';
import { LandingComponent } from './Front/landing/landing.component';
import { FooterFrontComponent } from './Front/footer-Front/footerFront.component';
import { HeaderComponent } from './Front/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { CommonModule } from '@angular/common';
import { NbAccordionModule, NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbToggleModule, NbTreeGridModule } from '@nebular/theme';

import { BacktestingResultComponent } from './backtesting-result/backtesting-result.component';
import { BacktestingFormComponent } from './backtesting-form/backtesting-form.component';
import { StrategyOptimizerComponent } from './strategy-optimizer/strategy-optimizer.component';
import { StockPreviewComponent } from './stock-preview/stock-preview.component';
import { BarElement, CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import { PredictionComponent } from './prediction/prediction.component';
import { enUS } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';
import { TooltipDirective } from './tooltip.directive';
import { AdvancedBacktestingComponent } from './advanced-backtesting/advanced-backtesting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompareStrategiesComponent } from './compare-strategies/compare-strategies.component';
import { WalkForwardComponent } from './walk-forward/walk-forward.component';
import { MonteCarloComponent } from './monte-carlo/monte-carlo.component';
import { StressTestComponent } from './stress-test/stress-test.component';
import { StrategyResultsComponent } from './strategy-results/strategy-results.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizSummaryComponent } from './quiz-summary/quiz-summary.component';
import { ChallengeComponent } from './Front/challenge/challenge.component';
import { TraderComponent } from './Front/trader/trader.component';
import { TransactionchallengeComponent } from './Front/Transactionn/transactionchallenge.component';
import { CreateChallengeComponent } from './Back/create-challenge/create-challenge/create-challenge.component';
import { LoginComponent } from './Front/login/login.component';
import { OrderFormComponent } from './Front/order-form/order-form.component';
import { ListPortfolioComponent } from './Back/list-portfolio/list-portfolio.component';
import { ListOrdersComponent } from './Back/list-orders/list-orders.component';
import { RegisterComponent } from './Front/register/register.component';
import { ListUsersComponent } from './Back/list-users/list-users.component';
import { UserProfileComponent } from './Back/user-profile/user-profile.component';
import { SearchfilterPipe } from './Pipes/searchFilter.pipe';
import { UserDetailsComponent } from './Back/user-details/user-details.component';
import { ResetPasswordComponent } from './Front/reset-password/reset-password.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NotAuthorizedComponent } from './Front/not-authorized/not-authorized.component';
import { ActivateAccountComponent } from './Front/activate-account/activate-account.component';
import { ListTransactionComponent } from './Back/list-transaction/list-transaction.component';
import { ChartComponent } from './Front/chart/chart.component';
import { ModalComponent } from './Front/modal/modal.component';
import { FinancialNewsComponent } from './Front/financial-news/financial-news.component';
import { ListorderComponent } from './Front/listorder/listorder.component';
import { OptionQuoteComponent } from './Front/option-quote/option-quote.component';
import { OilPricesQuoteComponent } from './Front/oil-prices-quote/oil-prices-quote.component';
import { PerformanceChartComponent } from './Front/performance-chart/performance-chart.component';
import { ShowTransactionsComponent } from './Front/show-transactions/show-transactions.component';
import { WatchlistComponent } from './Front/watchlist/watchlist.component';


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
//---------------- back
  BodyComponent,
  FooterComponent,
  NavComponent,
  SidebarComponent,
//------------ front
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
  TransactionchallengeComponent,  
  CreateChallengeComponent,
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
  ShowTransactionsComponent,
  WatchlistComponent
 
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbCardModule,
    NgChartsModule,
    NbAlertModule, 
    CommonModule,
    NbIconModule,
    NbBadgeModule,
    NbTreeGridModule,
    ReactiveFormsModule,
    NbAccordionModule,
    NbSpinnerModule,
    NbFormFieldModule,  
    NbDatepickerModule.forRoot(),  
    NbToggleModule, 
    NbToastrModule.forRoot(),
    NbTabsetModule,
    NbListModule,
    NbDatepickerModule,
    BrowserAnimationsModule,
    MatTabsModule,
    ReactiveFormsModule,   
    NgChartsModule

    
      
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

