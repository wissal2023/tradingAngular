import { Component, Input, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts'; // Import ApexCharts

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data: any[] = [];
  isCandlestickChart: boolean = true;  // Track current chart type
  constructor() {}
  ngOnInit() {
    this.renderChart(this.isCandlestickChart);
  }
  toggleChartType() {
    this.isCandlestickChart = !this.isCandlestickChart;
    this.renderChart(this.isCandlestickChart);  // Re-render chart with updated type
  }
  renderChart(isCandlestick: boolean) {
    const options = {
      chart: {
        type: isCandlestick ? 'candlestick' : 'line',  // Dynamically set chart type
        height: 500,
        width: '100%',
      },
      series: [{
        data: this.data
      }],
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        min: Math.min(...this.data.flatMap(d => d.y[1])) * 0.95, // Use dynamic price range
        max: Math.max(...this.data.flatMap(d => d.y[2])) * 1.05,
        tickAmount: 6,
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#00B746',
            downward: '#EF403C'
          },
          wick: {
            useFillColor: true
          }
        }
      },
      title: {
        text: 'Daily Stock Price ' + (isCandlestick ? 'Candlestick' : 'Line') + ' Chart',
        align: 'left'
      }
    };
    const chart = new ApexCharts (document.querySelector("#candle"), options);
    chart.render();
  }
}

