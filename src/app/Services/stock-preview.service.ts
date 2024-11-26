import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { StockData } from '../Entity/stock-data';

@Injectable({
  providedIn: 'root'
})
export class StockPreviewService {
  private readonly ALPHA_VANTAGE_API_KEY = '8EFEBJLEMMIC6PHE';
  private readonly ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

  constructor(private http: HttpClient) {}

  getHistoricalData(symbol: string): Observable<StockData[]> {
    const params = {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: 'full',
      apikey: this.ALPHA_VANTAGE_API_KEY
    };

    return this.http.get(this.ALPHA_VANTAGE_URL, { params }).pipe(
      map((response: any) => {
        const timeSeries = response['Time Series (Daily)'];
        if (!timeSeries) {
          throw new Error('No data available for this symbol');
        }

        return Object.entries(timeSeries).map(([date, data]: [string, any]) => ({
          date: new Date(date),
          openPrice: parseFloat(data['1. open']),
          highPrice: parseFloat(data['2. high']),
          lowPrice: parseFloat(data['3. low']),
          closePrice: parseFloat(data['4. close']),
          volume: parseInt(data['5. volume'])
        })).sort((a, b) => a.date.getTime() - b.date.getTime());
      }),
      catchError(error => {
        throw new Error('Failed to fetch stock data: ' + error.message);
      })
    );
  }
}
