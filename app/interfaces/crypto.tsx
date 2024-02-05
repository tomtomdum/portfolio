export interface PriceData {
    price: number;
    time: string;
}

export interface TradingPair {
    id: string;
    base_currency: string;
    quote_currency: string;
    quote_increment: string;
    base_increment: string;
    display_name: string;
    min_market_funds: string;
    margin_enabled: boolean;
    post_only: boolean;
    limit_only: boolean;
    cancel_only: boolean;
    status: string;
    status_message: string;
    trading_disabled: boolean;
    fx_stablecoin: boolean;
    max_slippage_percentage: string;
    auction_mode: boolean;
    high_bid_limit_percentage: string;
}

export interface TradeData {
    trade_id: number;
    side: string;
    size: string;
    price: string;
    time: string;
}