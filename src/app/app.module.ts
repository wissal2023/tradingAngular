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
import { FormsModule } from '@angular/forms';
import { IntraDayComponent } from './Front/intra-day/intra-day.component';
import { HoldingComponent } from './Front/holding/holding.component';
import { TransactionComponent } from './Front/transaction/transaction.component';
import { PlaceOrderComponent } from './Front/place-order/place-order.component';
import { ChallengeComponent } from './Front/challenge/challenge.component';
import { TraderComponent } from './Front/trader/trader.component';
import { TransactionchallengeComponent } from './Front/Transactionn/transactionchallenge.component';
import { ReactiveFormsModule } from '@angular/forms';
//import { ChartsModule } from 'ng2-charts';
import { CreateChallengeComponent } from './Back/create-challenge/create-challenge/create-challenge.component';

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
  ChallengeComponent,
   TraderComponent,
  TransactionchallengeComponent,
 
  CreateChallengeComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule, 
   
    //ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

