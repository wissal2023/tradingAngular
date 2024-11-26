import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { catchError, debounceTime, distinctUntilChanged, filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { BacktestingService } from '../Services/backtesting.service';
import { StockData } from '../Entity/stock-data';
import { FormControl, FormGroup } from '@angular/forms';
import { StockPreviewService } from '../Services/stock-preview.service';
import { enUS } from 'date-fns/locale';


@Component({
  selector: 'app-stock-preview',
  templateUrl: './stock-preview.component.html',
  styleUrls: ['./stock-preview.component.css']
})
export class StockPreviewComponent implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  
  chartData: any = {
    datasets: []
  };
  
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Historical Stock Price',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#1a237e'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(26, 35, 126, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label === 'Price') {
              return `${label}: $${context.parsed.y.toFixed(2)}`;
            }
            return `${label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'PP',
          displayFormats: {
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        adapters: {
          date: {
            locale: enUS
          }
        },
        title: {
          display: true,
          text: 'Date',
          color: '#666666',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#666666'
        }
      },
      y: {
        position: 'left',
        title: {
          display: true,
          text: 'Price ($)',
          color: '#666666',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#666666',
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      },
      y1: {
        position: 'right',
        grid: {
          display: false,
          drawBorder: false
        },
        title: {
          display: true,
          text: 'Volume',
          color: '#666666',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#666666'
        }
      }
    }
  };

  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  private symbolInput$ = new Subject<string>();

  constructor(private stockPreviewService: StockPreviewService) {}

  ngOnInit() {
    if (!this.parentForm) {
      console.error('ParentForm is required for StockPreviewComponent');
      return;
    }

    const symbolControl = this.parentForm.get('symbol');
    if (!symbolControl) {
      console.error('Symbol control not found in parent form');
      return;
    }

    // Subscribe to symbol changes
    this.symbolInput$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(symbol => {
        this.loading = true;
        this.error = null;
        return this.stockPreviewService.getHistoricalData(symbol);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.updateChart(data);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.clearChart();
      }
    });

    // Watch for symbol changes in the parent form
    symbolControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(symbol => {
        if (symbol && symbol.length >= 1) {
          this.symbolInput$.next(symbol.toUpperCase());
        } else {
          this.clearChart();
        }
      });
  }

  private updateChart(data: StockData[]) {
    const priceGradient = this.createPriceGradient(data);
    
    this.chartData = {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Price',
          data: data.map(item => ({
            x: item.date,
            y: item.closePrice
          })),
          borderColor: '#2196f3',
          backgroundColor: priceGradient,
          fill: true,
          yAxisID: 'y',
          tension: 0.2,
          pointRadius: 0,
          pointHitRadius: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#2196f3',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        },
        {
          label: 'Volume',
          data: data.map(item => ({
            x: item.date,
            y: item.volume
          })),
          yAxisID: 'y1',
          type: 'bar',
          backgroundColor: 'rgba(156, 39, 176, 0.3)',
          borderColor: 'rgba(156, 39, 176, 0.7)',
          borderWidth: 1
        }
      ]
    };
  }
  private createPriceGradient(data: StockData[]) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(33, 150, 243, 0.3)');
    gradient.addColorStop(1, 'rgba(33, 150, 243, 0.05)');
    return gradient;
  }
  private clearChart() {
    this.chartData = {
      labels: [],
      datasets: []
    };
    this.error = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}