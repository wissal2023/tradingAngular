import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/Services/auth.service';
import { BacktestingService } from 'src/app/Services/backtesting.service';

@Component({
  selector: 'app-backtesting-form',
  templateUrl: './backtesting-form.component.html',
  styleUrls: ['./backtesting-form.component.css']
})
export class BacktestingFormComponent implements OnInit, OnDestroy {
  backtestingForm: FormGroup = this.initializeForm();
  error: string | null = null;
  strategies: string[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private backtestingService: BacktestingService,
    private authService: AuthService,
    private router: Router
  ) {}

  private initializeForm(): FormGroup {
    return this.fb.group({
      symbol: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]{1,5}$/)
      ]],
      startDate: ['', [
        Validators.required,
        this.dateValidator()
      ]],
      endDate: ['', [
        Validators.required,
        this.dateValidator()
      ]],
      strategy: ['', Validators.required],
      initialCapital: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d*\.?\d+$/),
        this.numberValidator()
      ]]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit() {
    this.loadStrategies();
    this.setupFormValidation();
    this.setupFormSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormSubscriptions(): void {
    const symbolControl = this.backtestingForm.get('symbol');
    const startDateControl = this.backtestingForm.get('startDate');
    const endDateControl = this.backtestingForm.get('endDate');

    if (symbolControl && startDateControl && endDateControl) {
      merge(
        symbolControl.valueChanges,
        startDateControl.valueChanges,
        endDateControl.valueChanges
      ).pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.backtestingForm.updateValueAndValidity();
      });
    }
  }

  private setupFormValidation(): void {
    const startDateControl = this.backtestingForm.get('startDate');
    const endDateControl = this.backtestingForm.get('endDate');

    if (startDateControl && endDateControl) {
      startDateControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          endDateControl.updateValueAndValidity();
        });
    }
  }

  private dateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(control.value);
      const today = new Date();
      
      if (isNaN(date.getTime())) {
        return { invalidDate: true };
      }
      
      if (date > today) {
        return { futureDate: true };
      }
      
      return null;
    };
  }

  private numberValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const num = parseFloat(control.value);
      if (isNaN(num)) {
        return { invalidNumber: true };
      }
      
      if (num <= 0) {
        return { positiveRequired: true };
      }
      
      return null;
    };
  }

  private dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    if (!(group instanceof FormGroup)) {
      return null;
    }

    const startDate = new Date(group.get('startDate')?.value);
    const endDate = new Date(group.get('endDate')?.value);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return null;
    }
    
    if (startDate > endDate) {
      return { dateRange: true };
    }
    
    return null;
  }

 onSubmit() {
    if (this.backtestingForm.valid && !this.loading) {
      this.loading = true;
      this.error = null;

      const formValue = this.backtestingForm.value;
      
      // Parse and validate initialCapital
      const initialCapital = parseFloat(formValue.initialCapital);
      if (isNaN(initialCapital) || initialCapital <= 0) {
        this.error = 'Invalid initial capital value';
        this.loading = false;
        return;
      }

      const formData = {
        symbol: formValue.symbol.toUpperCase(),
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        strategy: formValue.strategy,
        initialCapital: initialCapital
      };

      if (this.validateFormData(formData)) {
        this.backtestingService.runBacktest(formData)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => this.loading = false)
          )
          .subscribe({
            next: (result) => {
              this.router.navigate(['/backtest-results'], { state: { result } });
            },
            error: (error) => {
              this.handleError(error);
            }
          });
      } else {
        this.loading = false;
        this.error = 'Invalid form data. Please check your inputs.';
      }
    } else {
      this.markFormGroupTouched(this.backtestingForm);
      this.error = 'Please fix the validation errors before submitting.';
    }
  }

  private validateFormData(formData: any): boolean {
    return (
      formData.symbol &&
      formData.symbol.length > 0 &&
      formData.symbol.length <= 5 &&
      formData.startDate &&
      formData.endDate &&
      formData.strategy &&
      typeof formData.initialCapital === 'number' &&
      !isNaN(formData.initialCapital) &&
      formData.initialCapital > 0 &&
      new Date(formData.startDate) <= new Date(formData.endDate)
    );
  }

  loadStrategies() {
    this.backtestingService.getAvailableStrategies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (strategies) => {
          this.strategies = strategies;
        },
        error: (error) => {
          console.error('Strategy loading error:', error);
          this.error = 'Failed to load strategies. Please refresh the page.';
        }
      });
  }

  private handleError(error: any): void {
    console.error('Backtest error:', error);
    
    if (error?.error?.error) {
      this.error = error.error.error;
    } else if (error?.message) {

      this.error = error.message;
    } else {
      this.error = 'An unexpected error occurred. Please try again.';
    }
  }

 private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.backtestingForm.get(fieldName);
    return !!field && field.invalid && (field.touched || field.dirty);
  }

  getErrorMessage(controlName: string): string {
    const control = this.backtestingForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    const errorMessages: { [key: string]: string } = {
      required: 'This field is required',
      pattern: this.getPatternErrorMessage(controlName),
      min: 'Value must be greater than 0',
      invalidDate: 'Invalid date',
      futureDate: 'Date cannot be in the future',
      invalidNumber: 'Please enter a valid number',
      positiveRequired: 'Value must be greater than 0',
      dateRange: 'End date must be after start date'
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'Invalid input';
  }

  private getPatternErrorMessage(controlName: string): string {
    switch (controlName) {
      case 'symbol':
        return 'Symbol must be 1-5 letters';
      case 'initialCapital':
        return 'Must be a valid number';
      default:
        return 'Invalid format';
    }
  }

  // Helper method for template
  getDateErrorMessage(): string {
    if (this.backtestingForm.hasError('dateRange')) {
      return 'End date must be after start date';
    }
    return '';
  }
}