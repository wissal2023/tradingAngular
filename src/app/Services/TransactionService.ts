import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Transaction } from 'src/app/Entity/Transactionn'; 
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8089/home/api/transactions';
  private binanceApiUrl = 'https://api.binance.com/api/v3/ticker/24hr';
 
  constructor(private http: HttpClient) { }
  private description: { [key: string]: string } = {
    'patent': 'A patent is an exclusive right granted for an invention.',
    'trademark': 'A trademark is a sign capable of distinguishing the goods or services of one enterprise from those of other enterprises.',
    'copyright': 'Copyright is a legal right that grants the creator of original work exclusive rights.',
    'brand': 'A brand is a name, term, design, symbol, or other feature that distinguishes an organization.',
    'license': 'A license is the permission granted by the owner to use something, such as intellectual property.',
    'software': 'Software is a collection of data or computer instructions that tell the computer how to perform specific tasks.'
  };

  // Méthode pour obtenir la description d'un actif intangible
  getDescription(intangibleAsset: string): Observable<string> {
    return of(this.description[intangibleAsset] || 'Description not available.');
  }
createTransaction(challengeId: number, transaction: Transaction): Observable<Transaction> {
  const apiUrl = `http://localhost:8089/home/api/transactions/${challengeId}/transactions`; // Inclure l'ID du challenge dans l'URL
  return this.http.post<Transaction>(apiUrl, transaction,{
    headers: { 'Accept': '*/*' }
  });
}

getBondYield(): Observable<any> {
  return this.http.get<any>('https://api.example.com/bonds/rendement');  // Remplacez l'URL par une API réelle
}



getCryptoPrice(cryptoSymbol: string): Observable<any> {
  const apiUrl = 'https://api.ourbit.com/v1';
  return this.http.get(`${apiUrl}/price/${cryptoSymbol}`);
}

getCryptoHistoricalData(cryptoSymbol: string): Observable<any> {
  const apiUrl = 'https://api.ourbit.com/v1';
  return this.http.get(`${apiUrl}/historical/${cryptoSymbol}`);
}




  // Méthode pour récupérer toutes les transactions
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // Méthode pour récupérer une transaction par ID
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour mettre à jour une transaction
  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  // Méthode pour supprimer une transaction
  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
