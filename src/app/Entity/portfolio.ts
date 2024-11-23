import { User } from './user';
import { Transaction } from './transaction';
import { Holding } from './holding';
import { PlacingOrder } from './placing-order';

export class Portfolio {
    id!: number;
    totVal!: number;
    dateCreated!: Date;
    accVal!: number;
    buyPow!: number;
    cash!: number;  
      
    tdyChange?: number;
    annReturn?: number;
    totGainLoss?: number;
    
    user!: User;
    transactions!: Transaction[];
    holdings!: Holding[];
    placingOrders!: PlacingOrder[];
}
