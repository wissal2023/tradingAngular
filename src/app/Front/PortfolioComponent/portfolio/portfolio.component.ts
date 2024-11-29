import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacingOrder } from 'src/app/Entity/placing-order';
import { Portfolio } from 'src/app/Entity/portfolio';
import { User } from 'src/app/Entity/user';
import { AuthService } from 'src/app/Services/auth.service';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';
import { UserService } from 'src/app/Services/user.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit{
  //marketStatus: any;
  portfolios: Portfolio[] = [];
  orders: PlacingOrder[] = [];
  searchResults: any[] = [];
  searchTerm: string = '';
  
  marketStatus: any[] = [];
  currentIndex: number = 0;
    
  portfolio!: Portfolio;       // Store the specific portfolio
  user!:User;
  portfolioId!: number;
  userId!: number;
  currentUser: any

  constructor(private stockQuoteService: StockQuoteService,
              private userService: UserService,
              private authService: AuthService,
              private actR:ActivatedRoute) {}

  ngOnInit() {   
    this.actR.params.subscribe((params) => {this.userId = params['userId'];// Extract userId from route parameters
      if (this.userId) {
        this.loadUser(this.userId); 
        
      } else {
        console.error('User ID not found in route parameters');
      }
      this.portfolioId = params['portfolioId'];// If portfolioId is also needed, extract it
    });

    this.loadCurrentUser(); 
  }
  loadUser(userId: number) {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        this.portfolio = user.portfolio; // Extract the portfolio from user
        console.log('Portfolio:', this.portfolio);
        console.log('User and Portfolio loaded:', user);
      },
      (error) => {
        console.error('Error loading user:', error);
      }
    );
  }
  loadCurrentUser() {
    const storedUser = this.authService.getCurrentUser();
    if (storedUser) {
      this.currentUser = storedUser;
      this.user = this.currentUser;  // Assign currentUser to user
      console.log('Current User:', this.currentUser);
      this.loadUser(this.currentUser.id); // Load associated portfolio if required
    } else {
      console.error('No user is currently logged in.');
    }
  }
  
// search if Market Open/ closed
search() {
  if (this.searchTerm) {
    this.stockQuoteService.searchStockSymbols(this.searchTerm,  this.stockQuoteService.apiKey).subscribe(
      (data: any) => {
        this.searchResults = data.bestMatches; 
      },
      (error) => {
        console.error('Error fetching stock data', error);
      }
    );
  }
}
nextSlide(): void {
  this.currentIndex = (this.currentIndex + 1) % this.marketStatus.length;
  this.updateCarouselPosition();
}
prevSlide(): void {
  this.currentIndex = (this.currentIndex - 1 + this.marketStatus.length) % this.marketStatus.length;
  this.updateCarouselPosition();
}
updateCarouselPosition(): void {
  const track = document.querySelector('.carousel-track') as HTMLElement;
  const offset = -this.currentIndex * 250; // Assuming each card is 250px wide
  track.style.transform = `translateX(${offset}px)`;
}
  
}
