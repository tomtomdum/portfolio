import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
    size: number;
    price: number;
    time: string;
}


export interface TradeDataCol {
    trade_id: number
    side: string
    size: number
    price: number
    time: string
}
export const columnsTable: ColumnDef<TradeDataCol>[] = [
    {
        accessorKey: 'trade_id',
        header: 'Trade ID',
    },
    {
        accessorKey: 'side',
        header: 'Action',
    },
    {
        accessorKey: 'size',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Size
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },


    },
    {
        accessorKey: 'time',


        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },

    }
];
