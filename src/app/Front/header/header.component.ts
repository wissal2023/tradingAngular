import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Entity/user';
import { AuthService } from 'src/app/Services/auth.service';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() portfolioId!: number; 
  marketStatus: any[] = [];
  isLoggedIn: boolean = false;  // To track the login status
  user!:User;

  constructor(private stockQuoteService: StockQuoteService, 
              private route: ActivatedRoute, 
              private authService: AuthService) {}  
  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getCurrentUser(); // Check if user data exists in localStorage
    this.route.params.subscribe((params) => {
      this.portfolioId = +params['portfolioId'];
    });
    // Fetch the logged-in user details
  const currentUser = this.authService.getCurrentUser();
  if (currentUser) {
    this.user = currentUser;
  }
    
  }

  

  getMarketStatus(): void {
    this.stockQuoteService.getMarketStatus(this.stockQuoteService.apiKey).subscribe((response: any) => {
      if (response && response.markets) {
        this.marketStatus = response.markets;
      }
    }, (error) => {
      console.error('Error fetching market status:', error);
    });
  }
}
