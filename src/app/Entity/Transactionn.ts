export interface Transaction {
    id?: number;

    price?: number; 
    currency?: string; 
    transactionDate?: Date; 
    quantity?: number; 
    type?: Type;
    status?:Status;
    totalAmount?:number ;
    // Attributs supplémentaires pour la catégorie INTANGIBLES
  intangibleAsset?: string;   // Type d'actif incorporel
  intangibleValue?: number;   // Valeur de l'actif incorporel
  rightsExpiryDate?: Date;    // Date d'expiration des droits/licence
  description?: string;       // Description de l'actif incorporel
  ownershipStatus?: string;   // Statut de la propriété (propriétaire, licencié, etc.)
  marketValue?: number;       // Valeur marchande de l'actif
  investmentAmount?: number;  // Montant investi dans l'actif
  expectedRevenue?: number;   // Revenu attendu de l'actif


  // Attributs pour la catégorie OBLIGATIONS
  bondAmount: number ; // Montant de l'obligation
  interestRate: number ; // Taux d'intérêt
  maturityDate: Date ; // Date d'échéance
  issuer: string ; // Émetteur de l'obligation
  faceValue: number ; // Valeur nominale
    
  }
 
  export enum Status {

    PENDING = "PENDING",
     COMPLETED= "COMPLETED",
     FAILED= "FAILED",
  }

  export enum Type {
    BUY = 'BUY',
    SELL = 'SELL',
  }
  