import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Entity/transaction';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.css']
})
export class ListTransactionComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(
      (data: Transaction[]) => {
        this.transactions = data;
      },
      (error) => {
        console.error('Failed to load transactions', error);
      }
    );
  }

  deleteTransaction(id: number): void {
    this.transactionService.removeTransaction(id).subscribe(
      () => {
        console.log('Transaction deleted successfully');
        this.loadTransactions(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Failed to delete transaction', error);
      }
    );
  }
}
