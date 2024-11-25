import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredictionResponse } from '../Entity/prediction-response';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { PredictionService } from '../Services/prediction-service.service';
import { NbToastrService } from '@nebular/theme';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
 // Add this property to store normalized indicators
 normalizedIndicators: Array<{label: string, value: number, percentage: number}> = [];
 protected readonly Math = Math; 
  predictionForm!: FormGroup;
  predictionResponse: PredictionResponse | null = null;
  isLoading = false;

 
  timeframeUnits = [
    { value: 'DAYS', label: 'Days' },
    { value: 'WEEKS', label: 'Weeks' },
    { value: 'MONTHS', label: 'Months' }
  ];

  constructor(
    private fb: FormBuilder,
    private predictionService: PredictionService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }


  initForm(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    this.predictionForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      startDate: [this.formatDate(today), Validators.required],
      endDate: [this.formatDate(tomorrow), Validators.required],
      predictionTimeframe: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
      timeframeUnit: ['DAYS', Validators.required]
    });
  
    // Add validation for end date after start date
    this.predictionForm.get('endDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  
    this.predictionForm.get('startDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }
  
  validateDates(): void {
    const startDate = new Date(this.predictionForm.get('startDate')?.value);
    const endDate = new Date(this.predictionForm.get('endDate')?.value);
    
    if (startDate && endDate && endDate <= startDate) {
      this.predictionForm.get('endDate')?.setErrors({ 'invalidDate': true });
    } else {
      this.predictionForm.get('endDate')?.setErrors(null);
    }
  }
  
  hasTechnicalIndicators(): boolean {
    // Check if technicalIndicators exists and is not empty
    if (!this.predictionResponse?.technicalIndicators) return false;
    
    // Convert the response to a Map if it's a plain object
    if (!(this.predictionResponse.technicalIndicators instanceof Map)) {
      this.predictionResponse.technicalIndicators = new Map(
        Object.entries(this.predictionResponse.technicalIndicators as any)
      );
    }
    
    return this.predictionResponse.technicalIndicators.size > 0;
  }
  onSubmit(): void {
    if (this.predictionForm.invalid) {
      this.toastrService.warning('Please fill out all required fields correctly', 'Invalid Form');
      return;
    }

    const request = {
      symbol: this.predictionForm.get('symbol')?.value,
      startDate: this.formatDate(this.predictionForm.get('startDate')?.value),
      endDate: this.formatDate(this.predictionForm.get('endDate')?.value),
      predictionTimeframe: this.predictionForm.get('predictionTimeframe')?.value,
      timeframeUnit: this.predictionForm.get('timeframeUnit')?.value
    };

    this.isLoading = true;
    this.predictionResponse = null;

    this.predictionService.predictPrice(request).subscribe({
      next: (response) => {
        if (response.technicalIndicators && !(response.technicalIndicators instanceof Map)) {
          response.technicalIndicators = new Map(Object.entries(response.technicalIndicators));
        }
        this.predictionResponse = response;
        if (this.hasTechnicalIndicators()) {
          this.processIndicators();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastrService.danger(
          error.error?.message || 'Unable to generate prediction',
          'Prediction Error'
        );
        this.isLoading = false;
      }
    });
  }

  processIndicators(): void {
    if (!this.predictionResponse?.technicalIndicators) return;

    const indicators = this.predictionResponse.technicalIndicators;
    
    // Convert indicators to array and normalize values
    let indicatorArray = Array.from(indicators.entries()).map(([key, value]) => ({
      label: key,
      value: typeof value === 'number' ? Number(value.toFixed(2)) : 0
    }));

    // Sort by value
    indicatorArray.sort((a, b) => b.value - a.value);

    // Find the maximum absolute value for normalization
    const maxAbsValue = Math.max(...indicatorArray.map(item => Math.abs(item.value)));

    // Normalize values to percentages
    this.normalizedIndicators = indicatorArray.map(item => ({
      label: item.label,
      value: item.value,
      percentage: (item.value / maxAbsValue) * 100
    }));
  }

  private formatDate(date: Date | string): string {
    // If the date is already a string, return it directly
    if (typeof date === 'string') {
      return date;
    }
  
    // If it's a Date object, convert to ISO string and extract the date part
    return date.toISOString().split('T')[0];
  }

}