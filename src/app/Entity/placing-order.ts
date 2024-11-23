import { Portfolio } from "./portfolio";
import { Transaction } from "./transaction";

export class PlacingOrder {
    id!: number;
    symbol!: string;
    qty!: number;
    price!: number;
    date!: Date;
    note?: string;
    param!: string;
    duration!: string;
    stopLoss?: number;
    takeProfit?: number;
    margin?: number;     
    faceValue?: number; // Specific Fields For Bonds
    couponRate?: number;
    maturityDate?: Date;    
    strikePrice?: number;//  Specific Fields For Options
    expirationDate?: Date;    
    contractSize?: number;//  Specific Fields For Commodities
    expiryDate?: Date;    
    nav?: number;//  Specific Fields For Mutual Funds and ETFs
    assetsType!: AssetsType;// Enums
    orderType!: OrderType;
    actionType!: ActionType;
    status!: Status;
    transactions!: Transaction[];  
    
}
    
export enum AssetsType {
    STOCKS = 'STOCKS',
    OPTIONS = 'OPTIONS',
    BONDS = 'BONDS',
    COMMODITIES = 'COMMODITIES',
    FOREX = 'FOREX',
    MUTUAL_FUNDS = 'MUTUAL_FUNDS',
    ETF = 'ETF',
    CRYPTO='CRYPTO'
}

export enum OrderType {
    MARKET = 'MARKET',
    LIMIT = 'LIMIT',
    STOP_LIMIT = 'STOP_LIMIT',
    TRAILING_STOP = 'TRAILING_STOP'
}

export enum ActionType {
    BUY = 'BUY',
    SELL = 'SELL',
    SHORT = 'SHORT',
    COVER = 'COVER',
    CALL = 'CALL',
    PUT = 'PUT'
}

export enum Status {
    OPEN = 'OPEN',
    FILLED = 'FILLED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING'
}
