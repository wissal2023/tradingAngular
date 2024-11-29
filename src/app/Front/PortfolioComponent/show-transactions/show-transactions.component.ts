import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from 'src/app/Entity/transaction';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-show-transactions',
  templateUrl: './show-transactions.component.html',
  styleUrls: ['./show-transactions.component.css']
})
export class ShowTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  portfolioId: number = 0;

  constructor(private transactionService: TransactionService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get portfolioId from route parameters
    this.route.params.subscribe(params => {
      this.portfolioId = +params['portfolioId']; // Ensure conversion to number
      this.loadTransactions();
    });
  }

  // Load transactions for the specific portfolio
  private loadTransactions(): void {
    if (this.portfolioId) {
      this.transactionService
        .getTransactionsByPortfolioId(this.portfolioId)
        .subscribe((data) => {
          this.transactions = data;
        });
    } else {
      console.error('Portfolio ID is not provided.');
    }
  }
}
