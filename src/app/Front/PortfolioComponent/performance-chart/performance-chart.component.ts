import { Component, OnInit } from '@angular/core';
import { PortfolioService } from 'src/app/Services/portfolio.service';
import { TransactionService } from 'src/app/Services/transaction.service';
import { ChartData, ChartOptions } from 'chart.js';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-performance-chart',
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.css']
})
export class PerformanceChartComponent implements OnInit {

  portfolioData: { date: Date, portfolioValue: number }[] = [];
  portfolioId!: number;

  constructor(private portfolioService: PortfolioService, 
              private transactionService: TransactionService, 
              private actR: ActivatedRoute) {}

  ngOnInit() {
    this.actR.params.subscribe((params) => {
      this.portfolioId = params['portfolioId'];
    });    
    this.getPortfolioData();
  }

  public chartData: ChartData<'line'> = {
    labels: [] as string[], 
    datasets: [{
      label: 'Portfolio Value',
      data: [] as number[],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 2,
      pointRadius: 5,
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointHoverRadius: 7,
      fill: 'origin',
      tension: 0.4
    }]
  };

  public chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Helvetica, Arial, sans-serif',
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        callbacks: {
          label: function(tooltipItem: any) {
            const value = tooltipItem.raw as number;
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 16,
            family: 'Arial, sans-serif'
          }
        },
        ticks: {
          font: {
            size: 12
          },
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Portfolio Value',
          font: {
            size: 16,
            family: 'Arial, sans-serif'
          }
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(tickValue: string | number) {
            if (typeof tickValue === 'number') {
              return '$' + tickValue.toLocaleString();
            }
            return tickValue;
          }
        }
      }
    }
    
  };

  getPortfolioData() {
    this.portfolioService.getPortfolioById(this.portfolioId).subscribe((portfolio) => {
      let portfolioData: { date: Date, portfolioValue: number }[] = [];
      let totalPortfolioValue = portfolio.accVal;
      portfolio.placingOrders.forEach(order => {
        totalPortfolioValue += order.qty * order.price;
        portfolioData.push({
          date: new Date(order.date),
          portfolioValue: totalPortfolioValue
        });
      });

      this.transactionService.getTransactionsByPortfolioId(this.portfolioId).subscribe((transactions) => {
        transactions.forEach(transaction => {
          totalPortfolioValue += transaction.quantity * transaction.price;
          portfolioData.push({
            date: new Date(transaction.date),
            portfolioValue: totalPortfolioValue
          });
        });

        portfolioData = portfolioData.sort((a, b) => a.date.getTime() - b.date.getTime());
        this.chartData.labels = portfolioData.map(data => data.date.toLocaleDateString());
        this.chartData.datasets[0].data = portfolioData.map(data => data.portfolioValue);
      });
    }, error => {
      console.error('Error fetching portfolio data:', error);
    });
  }
}
