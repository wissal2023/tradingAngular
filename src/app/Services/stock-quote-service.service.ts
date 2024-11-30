import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockQuoteService {
  private apiUrl = 'https://www.alphavantage.co/query';
  apiKey: string = 'GB675A5CC0KN3LWL';
  constructor(private http: HttpClient) {}

   // Get historical options data
   getHistoricalOptions(symbol: string, date?: string): Observable<any> {
    const params = new HttpParams()
      .set('function', 'HISTORICAL_OPTIONS')   // Set the function to 'HISTORICAL_OPTIONS'
      .set('symbol', symbol)                   // Set the symbol for the options data
      .set('apikey', this.apiKey)               // Optionally add the date, if provided

    return this.http.get(this.apiUrl, { params }); // Perform the GET request to Alpha Vantage API
  }
 // Get Brent crude oil prices
 getBrentCrudePrices(interval: string = 'monthly'): Observable<any> {
  const params = new HttpParams()
    .set('function', 'BRENT')         // Set the function to 'BRENT'
    .set('interval', interval)        // Set the interval as a query parameter (default is 'monthly')
    .set('apikey', this.apiKey)        // Set the datatype to 'json'

  return this.http.get(this.apiUrl, { params });  // Perform the GET request to Alpha Vantage API
}
   // get stock data
   getStockQuote(symbol: string, apiKey: string): Observable<any> {
    const params = {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      apikey: apiKey
    };
    return this.http.get(this.apiUrl, { params });
  }  
  // search glabal Market
  searchStockSymbols(keywords: string, apiKey: string): Observable<any> {
    const params = {
      function: 'SYMBOL_SEARCH',
      keywords: keywords,
      apikey: apiKey
    };

    return this.http.get(this.apiUrl, { params });
  }  
  getMarketStatus(apiKey: string): Observable<any> {
    const params = {
      function: 'MARKET_STATUS',
      apikey: apiKey
    };

    return this.http.get(this.apiUrl, { params });
  }
// chart in the order form
getDailyTimeSeries(symbol: string, apiKey: string): Observable<any> {
  const params = {
    function: 'TIME_SERIES_DAILY',
    symbol: symbol,
    apikey: apiKey
  };
  console.log('Fetching daily time series with params:', params); // Log the parameters
  return this.http.get(this.apiUrl, { params });
}


private eodhUrl = 'http://localhost:8094/home/API/financial-news';
  apiToken: string = '6719a97987dbd2.59347935';   
  getFinancialNews(ticker: string, limit: number = 10, offset: number = 0): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    return this.http.get(`${this.eodhUrl}/${ticker}`, { params });
  }
}




