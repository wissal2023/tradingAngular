import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BacktestingService } from './backtesting.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private backtestingService: BacktestingService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.backtestingService.getCurrentUser()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}