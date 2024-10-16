import { Transaction } from "./transaction";

export class PlacingOrder {
    id!: number;
    symbol!: string;
    qty!: number;
    price!: number;
    date!: Date;
    note?: string;
    param!: string;
    duration!: number;

    tradeType!: TradeType;
    orderType!: OrderType;
    transacType!: TransacType;
    status!: Status;
    
    transactions!: Transaction[];
}
export enum TradeType {
    STOCKS = 'STOCKS',
    OPTIONS = 'OPTIONS',
    BONDS = 'BONDS',
    COMMODITIES = 'COMMODITIES',
    FOREX = 'FOREX',
    MUTUAL_FUNDS = 'MUTUAL_FUNDS',
    ETF = 'ETF'
}

export enum OrderType {
    MARKET = 'MARKET',
    LIMIT = 'LIMIT',
    STOP_LIMIT = 'STOP_LIMIT',
    TRAILING_STOP = 'TRAILING_STOP'
}

export enum TransacType {
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
    CANCELLED = 'CANCELLED'
}
