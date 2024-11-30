import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/Services/TransactionService';
import { Transaction } from 'src/app/Entity/Transactionn';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router'; 
import { debounceTime } from 'rxjs/operators';
//import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-transactionchallenge',
  templateUrl: './transactionchallenge.component.html',
  styleUrls: ['./transactionchallenge.component.css']
})
export class TransactionchallengeComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionForm: FormGroup;
  isEditing: boolean = false;
  editingTransactionId: number | null = null;
  challengeId: number | null = null;
  //cryptoPrice: number = 0; 
  totalAmount: number = 0; 
  chart: any;
  predictionChart: any;
  selectedCryptoSymbol : any ;
  predictedPrice: number | null = null;
  roi: number | null = null;
  aiScore: number | null = null;
  recommendationMessage: string = '';


  predictedPriceTomorrow: number = 0;
  predictedPriceThisWeek: number = 0;
  predictedPriceNext30Days: number = 0;
  selectedSymbol: string = 'BTC'; // Symbol par défaut
  cryptoPrice: number | null = null;
  priceChangePercent: number | null = null;
  cryptoIdMap: { [key: string]: string } = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BNB: 'binancecoin',
    ADA: 'cardano',
    SOL: 'solana',
    XRP: 'ripple',
    DOT: 'polkadot'
};
volatility: number | null = null;
challengeType: string | null = null;
selectedCategory: string = '';

intangibleTypes = ['Patent', 'Trademark', 'Copyright', 'License', 'Software'];
  marketValue: number | null = null;
  ownershipStatus: string | null = null;
  selectedAsset: string = '';  // L'actif intangible sélectionné
  Description: string = '';  // Description de l'actif intangible

  calculateAIScore(): void {
    const investmentAmount = this.transactionForm.get('investmentAmount')?.value || 0;
    const expectedRevenue = this.transactionForm.get('expectedRevenue')?.value || 0;
  
    if (investmentAmount > 0) {
      const roi = ((expectedRevenue - investmentAmount) / investmentAmount) * 100;
      this.aiScore = Math.min(100, Math.max(0, roi)); // Score entre 0 et 100
    } else {
      this.aiScore = 0; // Par défaut si les données sont insuffisantes
    }
  
    this.aiScore = Math.floor(Math.random() * 100); // Remplacez cela par votre logique réelle
  this.recommendationMessage = this.getAssetRecommendation(this.aiScore);
  console.log('AI Score:', this.aiScore);
  console.log('Recommendation:', this.recommendationMessage);
  
    // Dessiner le graphique après avoir calculé le score
    this.drawCombinedChart();
  }
  getAssetRecommendation(score: number | null): string {
    if (score === null) {
      return "Score indisponible. Veuillez vérifier les données de l'actif.";
    }
  
    if (score > 80) {
      return "Cet actif est stratégique et fortement recommandé.";
    } else if (score >= 50 && score <= 80) {
      return "Cet actif est viable mais nécessite une analyse supplémentaire.";
    } else {
      return "Cet actif présente des risques significatifs.";
    }
  }
  

  onAssetChange(): void {
    if (this.selectedAsset) {
      this.transactionService.getDescription(this.selectedAsset)
        .subscribe(description => {
          this.Description = description;
        });
    } else {
      this.Description = '';
    }
  }
  




getCryptoIconUrl(symbol: string | undefined): string {
  if (!symbol) {
    console.error("Symbole de cryptomonnaie non défini, utilisation de l'icône par défaut");
    return 'assets/icons/default.png'; // Assurez-vous que cette icône par défaut existe
  }
  const url = `assets/icons/${symbol.toLowerCase()}.png`;
  console.log('Chemin du logo :', url); // Debug log pour vérifier le chemin de l'icône
  return url;
}

 
  cryptoData: any = {};


  
    // Liste pour stocker les prix de cryptomonnaies
    public cryptoPrices: number[] = []; 
  constructor(
    private transactionService: TransactionService, 
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, 
    private http: HttpClient 
  ) {
    this.transactionForm = this.formBuilder.group({
      price: [this.cryptoPrice, [Validators.required, Validators.min(0)]],
      cryptocurrency: ['', Validators.required], // Add cryptocurrency to form controls
      transactionDate: ['', Validators.required],
      quantity: ['1', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      status: ['PENDING'], // Default value
      // Attributs pour la catégorie OBLIGATIONS
     bondAmount: [null, [Validators.required]],
      interestRate: [null, [Validators.required]],
      maturityDate: ['', Validators.required],
      issuer: ['', Validators.required],
      faceValue: [null, [Validators.required]],
       // Attributs pour la catégorie INTANGIBLES
    intangibleAsset: ['', Validators.required], // Type de l'actif intangible
    intangibleValue: [null, [Validators.required , Validators.min(0)]], // Valeur de l'actif intangible
    rightsExpiryDate: ['', Validators.required], // Date d'expiration des droits ou licence
    description: ['', Validators.required], // Description de l'actif intangible
    ownershipStatus: ['', Validators.required], // Statut de la propriété (ex. Propriétaire, Licencié, etc.)
    marketValue: [null, [Validators.required]], // Valeur marchande de l'actif intangible
    investmentAmount: [null, [Validators.required, Validators.min(1)]],
    expectedRevenue: [null, [Validators.required, Validators.min(0)]]
  
      
    });
    Chart.register(...registerables);
  }




  ngOnInit(): void {
  
    this.selectedSymbol = 'BTC'; // Définit une valeur par défaut pour éviter undefined
    this.transactionForm.get('cryptocurrency')!.valueChanges.pipe(
      debounceTime(1000)  // Attendez 1 seconde avant de faire une nouvelle requête
    ).subscribe((value) => {
      this.selectedSymbol = value;
      this.loadCryptoData(); 
    });
    this.getBitcoinData(); 
  
    
    this.route.queryParams.subscribe(params => {
      this.challengeId = +params['challengeId']; // Convertir en nombre
      this.selectedCategory = params['category'];
      this.updateFormValidators(); 
    
      console.log('Parsed Challenge ID:', this.challengeId); // Debugging
      console.log('Parsed Category:', this.selectedCategory);
    
      // Mettre à jour le formulaire selon la catégorie
      this.updateFormForCategory();
      
    });
    
    
    // Calculate total amount when price or quantity changes
    this.transactionForm.get('price')?.valueChanges.subscribe(() => this.calculateTotalAmount());
    this.transactionForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotalAmount());
    this.calculateTotalAmount(); // Initial calculation
    this.loadTransactions(); // Load existing transactions if necessary
    this.transactionForm.get('cryptocurrency')!.valueChanges.subscribe((value) => {
      this.selectedCryptoSymbol = value;
      this.loadCryptoData(); // Charger les données lorsque l'utilisateur change de cryptomonnaie
  });
  this.transactionForm.get('investmentAmount')?.valueChanges.subscribe(() => this.calculateExpectedRevenue());
  this.transactionForm.get('intangibleValue')?.valueChanges.subscribe(() => this.calculateExpectedRevenue());
  this.transactionForm.get('ownershipStatus')?.valueChanges.subscribe(() => this.calculateExpectedRevenue());
 
  this.transactionForm.valueChanges.subscribe(() => {
    this.calculateROI();
    this.calculateAIScore(); // Calcul de la note IA
    this.calculateExpectedRevenue();

  });
} 
calculateROI(): void {
  const investmentAmount = this.transactionForm.get('investmentAmount')?.value || 0;
  const expectedRevenue = this.transactionForm.get('expectedRevenue')?.value || 0;

  if (investmentAmount > 0) {
    // Calculer le ROI
    this.roi = Math.round(((expectedRevenue - investmentAmount) / investmentAmount) * 100);

    // Appliquer un plafond pour éviter des ROI irréalistes
    if (this.roi > 100) {
      console.warn('ROI limité à 100 %. Vérifiez les données.');
      this.roi = 100; // Plafond
    }
  } else {
    console.error('Investment Amount doit être supérieur à 0.');
    this.roi = null;
  }

  console.log('ROI Calculé:', this.roi);
  this.drawCombinedChart();
}



getRoundedROI(): string {
  return this.roi !== null ? Math.round(this.roi) + ' %' : '';
}



calculateExpectedRevenue(): void {
  const investmentAmount = this.transactionForm.get('investmentAmount')?.value || 0;
  const intangibleValue = this.transactionForm.get('intangibleValue')?.value || 0;
  const marketValue = this.transactionForm.get('marketValue')?.value || 0;
  const ownershipStatus = this.transactionForm.get('ownershipStatus')?.value;

  let ownershipFactor = 1; // Facteur par défaut

  // Ajuster le multiplicateur en fonction du statut
  switch (ownershipStatus) {
    case 'Owner':
      ownershipFactor = 1.5; // Propriétaire
      break;
    case 'Licensor':
      ownershipFactor = 1.2; // Licencié
      break;
    case 'Licensee':
      ownershipFactor = 1; // Aucun ajout pour les utilisateurs finaux
      break;
  }

  const marketAdjustmentFactor = 0.05; // Ajustement basé sur la valeur marchande

  // Calcul d'Expected Revenue
  let expectedRevenue =
    investmentAmount +
    intangibleValue * ownershipFactor +
    marketValue * marketAdjustmentFactor;

  // Appliquer un plafond pour éviter des valeurs irréalistes
  if (expectedRevenue > investmentAmount * 10) {
    console.warn('Expected Revenue limité à 10x Investment Amount.');
    expectedRevenue = investmentAmount * 10;
  }

  console.log('Expected Revenue Calculé:', expectedRevenue);

  // Mettre à jour le champ dans le formulaire
  this.transactionForm.get('expectedRevenue')?.setValue(expectedRevenue, { emitEvent: false });
}



updateFormValidators(): void {
  // Réinitialiser les validations pour tous les champs
  Object.keys(this.transactionForm.controls).forEach(key => {
      this.transactionForm.get(key)?.clearValidators();
      this.transactionForm.get(key)?.updateValueAndValidity();
  });

  // Appliquer les validations spécifiques selon la catégorie
  if (this.selectedCategory === 'CRYPTOCURRENCY') {
      this.transactionForm.get('price')?.setValidators([Validators.required, Validators.min(0)]);
      this.transactionForm.get('quantity')?.setValidators([Validators.required, Validators.min(1)]);
      this.transactionForm.get('cryptocurrency')?.setValidators([Validators.required]);
      this.transactionForm.get('transactionate')?.setValidators([Validators.required]);
      this.transactionForm.get('type')?.setValidators([Validators.required]);
      this.transactionForm.get('status')?.setValidators([Validators.required]);
  } else if (this.selectedCategory === 'OBLIGATIONS') {
      this.transactionForm.get('bondAmount')?.setValidators([Validators.required]);
      this.transactionForm.get('interestRate')?.setValidators([Validators.required]);
      this.transactionForm.get('maturityDate')?.setValidators([Validators.required]);
      this.transactionForm.get('issuer')?.setValidators([Validators.required]);
      this.transactionForm.get('faceValue')?.setValidators([Validators.required]);
  } else if (this.selectedCategory === 'INTANGIBLES') {
      this.transactionForm.get('intangibleAsset')?.setValidators([Validators.required]);
      this.transactionForm.get('intangibleValue')?.setValidators([Validators.required]);
      this.transactionForm.get('rightsExpiryDate')?.setValidators([Validators.required]);
      this.transactionForm.get('description')?.setValidators([Validators.required]);
      this.transactionForm.get('ownershipStatus')?.setValidators([Validators.required]);
      this.transactionForm.get('marketValue')?.setValidators([Validators.required]);
      this.transactionForm.get('investmentAmount')?.setValidators([Validators.required]);
      this.transactionForm.get('expectedRevenue')?.setValidators([Validators.required]);
  }

  // Mettre à jour la validation
  this.transactionForm.updateValueAndValidity();
}

  
   // Méthode pour ajuster le formulaire selon la catégorie
   updateFormForCategory(): void {
    if (this.selectedCategory === 'CRYPTOCURRENCY') {
      // Affichez ou initialisez les champs pour la catégorie Cryptocurrency
      console.log('Cryptocurrency Form');
    } else if (this.selectedCategory === 'OBLIGATIONS') {
      // Affichez ou initialisez les champs pour la catégorie Obligations
      console.log('Obligations Form');
    } else if (this.selectedCategory === 'INTANGIBLES') {
      // Affichez ou initialisez les champs pour la catégorie Intangibles
      console.log('Intangibles Form');
    }
  }

  
 
  loadCryptoData() {
    if (!this.selectedCryptoSymbol) {
      console.error('Symbole de cryptomonnaie non défini');
      return;
    }

    const symbol = this.selectedCryptoSymbol + 'USDT';
    const apiUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=30`;
    const cryptoId = this.cryptoIdMap[this.selectedSymbol];

    if (!cryptoId) {
      console.error('ID de cryptomonnaie non trouvé pour le symbole:', this.selectedSymbol);
      return;
    }

    // Appel API CoinGecko pour le prix actuel
    const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_24hr_change=true`;

    // Récupérer le prix actuel
    this.http.get<any>(priceUrl).subscribe(response => {
      if (response && response[cryptoId]) {
        this.cryptoPrice = response[cryptoId].usd;
        this.priceChangePercent = response[cryptoId].usd_24h_change;
        this.transactionForm.get('price')?.setValue(this.cryptoPrice);
      }
    });

    // Récupérer les données historiques
    this.http.get(apiUrl).subscribe(
      (data: any) => {
        const prices = data.map((item: any) => parseFloat(item[4])); // Prix de clôture
        const timestamps = data.map((item: any) => new Date(item[0]).toLocaleDateString());
        this.cryptoPrices = prices;

        // Calculer la volatilité
        this.volatility = this.calculateVolatility(prices);
        console.log(`Volatilité de ${this.selectedSymbol}:`, this.volatility);

        if (!this.chart) {
          this.createChart(timestamps, prices, this.selectedSymbol);
        } else {
          this.updateChart(timestamps, prices, this.selectedSymbol);
        }
          // Calculer les prix prédit
          this.predictedPriceTomorrow = this.linearRegression(this.cryptoPrices, this.cryptoPrices.length + 1);
          this.predictedPriceThisWeek = this.linearRegression(this.cryptoPrices, this.cryptoPrices.length + 7);
          this.predictedPriceNext30Days = this.linearRegression(this.cryptoPrices, this.cryptoPrices.length + 30);

          // Mettre à jour le graphique des prévisions
          this.createPredictionChart(this.predictedPriceTomorrow, this.predictedPriceThisWeek, this.predictedPriceNext30Days);
      
      },
      (error) => {
        console.error('Erreur lors de la récupération des données de cryptomonnaie:', error);
      }
    );
  }

  calculateVolatility(prices: number[]): number {
    const returns = prices.map((price, index) => {
      if (index === 0) return 0; // Le premier rendement est 0
      return Math.log(price / prices[index - 1]);
    }).slice(1);

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
    const volatility = Math.sqrt(variance) * Math.sqrt(30); // Annualiser

    return volatility; // Retourne la volatilité annualisée
  }
  
 
  




  linearRegression(prices: number[], predictionPoint: number): number {
    const n = prices.length;
    const xSum = prices.reduce((acc, _, index) => acc + index, 0);
    const ySum = prices.reduce((acc, price) => acc + price, 0);
    const xySum = prices.reduce((acc, price, index) => acc + index * price, 0);
    const xSquaredSum = prices.reduce((acc, _, index) => acc + index * index, 0);

    const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    return slope * predictionPoint + intercept; // Prédiction pour le point suivant
  }
 
 

  
 
  
navigateToDashboard() {
  this.router.navigate(['/dash']); // Remplacez '/dashboard' par votre route réelle
}

  calculateTotalAmount() {
    const price = this.transactionForm.get('price')?.value || 0;
    const quantity = this.transactionForm.get('quantity')?.value || 0;
    this.totalAmount = price * quantity;
  }
  getBitcoinData(): void {
    this.http.get<any>('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30').subscribe(data => {
        const prices = data.prices.map((price: [number, number]) => price[1]);
        const timestamps = data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());

        this.createChart(timestamps, prices, 'Bitcoin');
    });
}

getEthereumData(): void {
    this.http.get<any>('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30').subscribe(data => {
        const prices = data.prices.map((price: [number, number]) => price[1]);
        const timestamps = data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());

        this.createChart(timestamps, prices, 'Ethereum');
    });
}

getBinanceCoinData(): void {
  this.http.get<any>('https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=usd&days=30').subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => price[1]);
      const timestamps = data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());

      this.createChart(timestamps, prices, 'BNB');
  });
}

getCardanoData(): void {
  this.http.get<any>('https://api.coingecko.com/api/v3/coins/cardano/market_chart?vs_currency=usd&days=30').subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => price[1]);
      const timestamps = data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());

      this.createChart(timestamps, prices, 'ADA');
  });
}

getSolanaData(): void {
  this.http.get<any>('https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=30').subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => price[1]);
      const timestamps = data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());

      this.createChart(timestamps, prices, 'SOL');
  });
}

getRippleData(): void {
  this.http.get<any>('https://api.coingecko.com/api/v3/coins/ripple/market_chart?vs_currency=usd&days=30').subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => price[1]);
      const timestamps = data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());

      this.createChart(timestamps, prices, 'XRP');
  });
}

getPolkadotData(): void {
  this.http.get<any>('https://api.coingecko.com/api/v3/coins/polkadot/market_chart?vs_currency=usd&days=30').subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => price[1]);
      const timestamps = data.prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());

      this.createChart(timestamps, prices, 'DOT');
  });
}


createChart(labels: string[], data: number[], selectedCryptocurrency: string): void {
  if (this.chart) {
      this.chart.destroy(); // Détruire l'ancien graphique avant d'en créer un nouveau
  }

  this.chart = new Chart('myChart', {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: `Price of ${selectedCryptocurrency} (USD)`,
              data: data,
              borderColor: '#42a5f5', // Couleur de la ligne
              backgroundColor: 'rgba(66, 165, 245, 0.2)', // Couleur d'arrière-plan
              borderWidth: 2,
              pointBackgroundColor: '#ffffff', // Couleur des points
              pointBorderColor: '#42a5f5', // Couleur des bordures des points
              pointHoverBackgroundColor: '#f44336', // Couleur des points au survol
              pointHoverBorderColor: '#ffffff',
              fill: true, // Remplissage sous la ligne
              tension: 0.3 // Courbure de la ligne
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true,
                  grid: {
                      color: '#e0e0e0' // Couleur des lignes de grille
                  }
              },
              x: {
                  grid: {
                      color: '#e0e0e0' // Couleur des lignes de grille
                  }
              }
          },
          plugins: {
              legend: {
                  labels: {
                      color: '#333', // Couleur de la légende
                  }
              }
          }
      }
  });
}

createPredictionChart(predictedPriceTomorrow: number, predictedPriceThisWeek: number, predictedPriceNext30Days: number): void {
  if (this.predictionChart) {
      this.predictionChart.destroy(); 
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const next30Days = new Date(today);
  next30Days.setDate(today.getDate() + 30);

  const predictionLabels = [
      tomorrow.toLocaleDateString(),  
      nextWeek.toLocaleDateString(),  
      next30Days.toLocaleDateString()  
  ];

  const predictedData = [
      predictedPriceTomorrow,
      predictedPriceThisWeek,
      predictedPriceNext30Days
  ];

  this.predictionChart = new Chart('predictionChart', {
      type: 'line',
      data: {
          labels: predictionLabels,
          datasets: [{
              label: 'Expected Price',
              data: predictedData,
              borderColor: '#ffcc00', // Couleur de la ligne
              backgroundColor: 'rgba(255, 204, 0, 0.2)', // Couleur d'arrière-plan
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#ffcc00',
              pointHoverBackgroundColor: '#f44336',
              pointHoverBorderColor: '#ffffff',
              fill: true,
              tension: 0.3 // Courbure de la ligne
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true,
                  grid: {
                      color: '#e0e0e0' // Couleur des lignes de grille
                  }
              },
              x: {
                  grid: {
                      color: '#e0e0e0' // Couleur des lignes de grille
                  }
              }
          },
          plugins: {
              legend: {
                  labels: {
                      color: '#333', // Couleur de la légende
                  }
              }
          }
      }
  });
}

drawCombinedChart(): void {
  const ctx = (document.getElementById('combinedChart') as HTMLCanvasElement).getContext('2d');

  if (!ctx) return;

  if (this.chart) {
    this.chart.destroy(); // Détruire le graphique précédent s'il existe
  }

  const roiValue = this.roi ? this.roi : 0; // ROI calculé
  const aiScoreValue = this.aiScore !== null ? this.aiScore : 0; // Score AI est déjà un nombre


  this.chart = new Chart(ctx, {
    type: 'bar', // Type de graphique barre
    data: {
      labels: ['ROI (%)', 'AI Score'], // Noms des barres
      datasets: [
        {
          label: 'Values',
          data: [roiValue, aiScoreValue], // Données pour ROI et Score AI
          backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'], // Couleurs
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'], // Bordures
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              return tooltipItem.raw + '%'; // Ajouter le symbole % pour les valeurs
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100, // Définir une limite si nécessaire
          title: {
            display: true,
            text: 'Percentage (%)', // Titre de l'axe Y
          },
        },
        x: {
          title: {
            display: true,
            text: 'Metrics', // Titre de l'axe X
          },
        },
      },
    },
  });
}





  updateChart(labels: string[], prices: number[], selectedCryptocurrency: string) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].label = `Price of ${selectedCryptocurrency} (USD)`;
      
      this.chart.data.datasets[0].data = prices;
      this.chart.update();
    }
  }
 
  
  
  
  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  onSubmit(): void {
      Object.keys(this.transactionForm.controls).forEach(key => {
    const controlErrors = this.transactionForm.get(key)?.errors;
    if (controlErrors) {
      console.error(`Erreur dans le champ "${key}":`, controlErrors);
    }
  });

  if (this.transactionForm.invalid) {
    console.error('Formulaire invalide:', this.transactionForm.errors);
    return;
  }

  console.log('Formulaire valide:', this.transactionForm.value);
    
  
    if (this.transactionForm.valid) {
      const transaction: Transaction = {
        ...this.transactionForm.value,
        currency: this.selectedCategory === 'CRYPTOCURRENCY' ? this.transactionForm.get('cryptocurrency')?.value : null,
        totalAmount: this.transactionForm.get('price')?.value * this.transactionForm.get('quantity')?.value,
      };
  
      if (this.isEditing) {
        this.transactionService.updateTransaction(this.editingTransactionId!, transaction).subscribe(() => {
          this.loadTransactions();
          this.resetForm();
        });
      } else {
        this.transactionService.createTransaction(this.challengeId!, transaction).subscribe(() => {
          this.loadTransactions();
          this.resetForm();
        });
      }
    } else {
      console.error('Formulaire invalide:', this.transactionForm.errors);
    }
    
  }
  

  editTransaction(transaction: Transaction): void {
    this.editingTransactionId = transaction.id!;
    this.isEditing = true;
    this.transactionForm.patchValue(transaction);
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe(() => {
      this.loadTransactions();
    });
  }

  resetForm(): void {
    this.transactionForm.reset();
    this.isEditing = false;
    this.editingTransactionId = null;
  }
}



