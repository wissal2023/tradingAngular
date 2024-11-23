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
import { WatchlistComponent } from './Front/watchlist/watchlist.component';
import { LoginComponent } from './Front/login/login.component';
import { OrderFormComponent } from './Front/order-form/order-form.component';
import { ListPortfolioComponent } from './Back/list-portfolio/list-portfolio.component';
import { ListOrdersComponent } from './Back/list-orders/list-orders.component';
import { ListTransactionComponent } from './Back/list-transaction/list-transaction.component';
import { ChartComponent } from './Front/chart/chart.component';
import { ModalComponent } from './Front/modal/modal.component';
import { FinancialNewsComponent } from './Front/financial-news/financial-news.component';
import { ListorderComponent } from './Front/listorder/listorder.component';
import { OptionQuoteComponent } from './Front/option-quote/option-quote.component';
import { OilPricesQuoteComponent } from './Front/oil-prices-quote/oil-prices-quote.component';



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
  WatchlistComponent,
  ChartComponent,
  LoginComponent,
  OrderFormComponent,
  ListPortfolioComponent,
  ListOrdersComponent,
  ListTransactionComponent,
  ModalComponent,
  FinancialNewsComponent,
  ListorderComponent,
  OptionQuoteComponent,
  OilPricesQuoteComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

