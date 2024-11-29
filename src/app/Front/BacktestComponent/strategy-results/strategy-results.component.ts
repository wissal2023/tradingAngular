import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { OptimizationResponse } from '../../../Entity/optimization-response';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { RiskLevel } from '../../../Entity/risk-level';
import { Router } from '@angular/router';

@Component({
  selector: 'app-strategy-results',
  templateUrl: './strategy-results.component.html',
  styleUrls: ['./strategy-results.component.css']
})
export class StrategyResultsComponent  implements OnChanges {
  @Input() optimizationResult: OptimizationResponse | null = null;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.optimizationResult = navigation.extras.state['optimizationResult'];
      // Initialize charts if we have data from navigation
      if (this.optimizationResult) {
        setTimeout(() => {
          this.updateCharts();
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['optimizationResult'] && changes['optimizationResult'].currentValue) {
      setTimeout(() => {
        this.updateCharts();
      });
    }
  }

  // Rolling Metrics Chart Configuration
  rollingMetricsChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [],
    labels: []
  };

  rollingMetricsChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  // Efficiency Ratios Chart Configuration
  efficiencyRatiosChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [],
    labels: []
  };

  efficiencyRatiosChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Efficiency Ratio'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  };


  // Streak Distribution Chart Configuration
  streakDistributionChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [{
      data: [],
      label: 'Streak Distribution',
      backgroundColor: []
    }],
    labels: []
  };

  streakDistributionChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  getRiskLevelColor(level: RiskLevel): string {
    switch (level) {
      case RiskLevel.LOW:
        return 'green';
      case RiskLevel.MEDIUM:
        return 'orange';
      case RiskLevel.HIGH:
        return 'red';
      default:
        return 'black';
    }
  }

  private updateCharts(): void {
    if (!this.optimizationResult) return;

    // Format dates for x-axis
    const formattedDates = this.optimizationResult.rollingMetrics.dates.map(
      date => new Date(date).toLocaleDateString()
    );

    // Update Rolling Metrics Chart
    this.rollingMetricsChartData = {
      labels: formattedDates,
      datasets: [
        {
          data: this.optimizationResult.rollingMetrics.returns,
          label: 'Returns',
          borderColor: '#4CAF50',
          fill: false,
          tension: 0.1
        },
        {
          data: this.optimizationResult.rollingMetrics.volatilities,
          label: 'Volatility',
          borderColor: '#FFA726',
          fill: false,
          tension: 0.1
        },
        {
          data: this.optimizationResult.rollingMetrics.sharpeRatios,
          label: 'Sharpe Ratio',
          borderColor: '#2196F3',
          fill: false,
          tension: 0.1
        },
        {
          data: this.optimizationResult.rollingMetrics.drawdowns,
          label: 'Drawdowns',
          borderColor: '#F44336',
          fill: false,
          tension: 0.1
        }
      ]
    };

    // Update Efficiency Ratios Chart
    const efficiencyEntries = Object.entries(this.optimizationResult.rollingMetrics.efficiencyRatios);
    this.efficiencyRatiosChartData = {
      // Reverse the arrays to show highest values at the top
      labels: efficiencyEntries.map(([key]) => key).reverse(),
      datasets: [{
        data: efficiencyEntries.map(([, value]) => value).reverse(),
        backgroundColor: '#2196F3',
        label: 'Efficiency Ratios',
        borderRadius: 4 // Optional: adds rounded corners to the bars
      }]
    };

    // Update Streak Distribution Chart
    const streakLabels = this.optimizationResult.streakAnalysis.streakDistribution.map(
      (_, index) => `Streak ${index - Math.floor(this.optimizationResult!.streakAnalysis.streakDistribution.length / 2)}`
    );
    
    this.streakDistributionChartData = {
      labels: streakLabels,
      datasets: [{
        data: this.optimizationResult.streakAnalysis.streakDistribution,
        backgroundColor: this.optimizationResult.streakAnalysis.streakDistribution.map(
          (_, index) => index < Math.floor(streakLabels.length / 2) ? '#F44336' : '#4CAF50'
        ),
        label: 'Streak Distribution'
      }]
    };

    // Force chart update
    if (this.chart?.chart) {
      this.chart.chart.update();
    }
  }
}