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
              private authService: AuthService) {}  // Inject AuthService here
  ngOnInit(): void {
    // Check if the user is logged in by checking user data in localStorage
    this.isLoggedIn = !!this.authService.getCurrentUser();  // Use injected authService
    this.route.params.subscribe((params) => {
      this.portfolioId = +params['portfolioId']; // Fetch portfolioId from route
    });
    
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
