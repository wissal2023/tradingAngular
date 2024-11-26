import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BacktestingService } from '../Services/backtesting.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authForm: FormGroup;
  isRegisterMode = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private backtestingService: BacktestingService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = null;
  }

  onSubmit() {
    if (this.authForm.valid) {
      const { username, password } = this.authForm.value;
      console.log('Attempting to login with:', { username, password });
      
      const action = this.isRegisterMode
        ? this.backtestingService.register(username, password)
        : this.backtestingService.login(username, password);
  
      action.subscribe({
        next: (user) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.error = error.error?.message || 'An error occurred';
          console.error('Login error:', error);
        }
      });
    }
  }
  
}
