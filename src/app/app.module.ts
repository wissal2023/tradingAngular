import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './Back/body/body.component';
import { FooterComponent } from './Back/footer/footer.component';
import { NavComponent } from './Back/nav/nav.component';
import { SidebarComponent } from './Back/sidebar/sidebar.component';

import { LandingComponent } from './Front/landing/landing.component';
import { FooterFrontComponent } from './Front/footer-Front/footerFront.component';
import { HeaderComponent } from './Front/header/header.component';
import { PortfolioComponent } from './Front/portfolio/portfolio.component';
import { StockQuoteComponent } from './Front/stock-quote/stock-quote.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntraDayComponent } from './Front/intra-day/intra-day.component';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { PlaceOrderComponent } from './Front/place-order/place-order.component';
import { NbAccordionModule, NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbToggleModule, NbTreeGridModule } from '@nebular/theme';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { BacktestingResultComponent } from './backtesting-result/backtesting-result.component';
import { BacktestingFormComponent } from './backtesting-form/backtesting-form.component';
import { StrategyOptimizerComponent } from './strategy-optimizer/strategy-optimizer.component';
import { StockPreviewComponent } from './stock-preview/stock-preview.component';
import { BarElement, CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import { enUS } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';
import { PredictionComponent } from './prediction/prediction.component';
import { TooltipDirective } from './tooltip.directive';
import { AdvancedBacktestingComponent } from './advanced-backtesting/advanced-backtesting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { CompareStrategiesComponent } from './compare-strategies/compare-strategies.component';
import { WalkForwardComponent } from './walk-forward/walk-forward.component';
import { MonteCarloComponent } from './monte-carlo/monte-carlo.component';
import { StressTestComponent } from './stress-test/stress-test.component';
import { StrategyResultsComponent } from './strategy-results/strategy-results.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizSummaryComponent } from './quiz-summary/quiz-summary.component';

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
  IntraDayComponent,
  HoldingComponent,
  TransactionComponent,
  PlaceOrderComponent,
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
    MatTabsModule
   
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

