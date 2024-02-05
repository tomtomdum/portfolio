import Link from 'next/link'
import { Check, ChevronsUpDown, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import TradeTable from '../table/page'
import HistoryChart from '../historyChart/page'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




import { cn } from '@/lib/utils'
import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { ColumnDef } from '@tanstack/react-table'
import APIService from '../api/cryptoCoinsService'
import { TradeData, PriceData, TradingPair } from '../interfaces/crypto'
//https://api.coinbase.com/v2/prices/BTC-USD/historic?days=76

export const columns: ColumnDef<TradeData>[] = [
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
        header: 'Size',
    },
    {
        accessorKey: 'price',
        header: 'Price',
    },
    {
        accessorKey: 'time',
        header: 'Time',
    },
];

const MainPage = () => {
    const { toast } = useToast()

    const [btcPriceHistory, setBtcPriceHistory] = useState<PriceData[]>([]);
    const [products, setProductsArray] = useState<TradingPair[]>([]);
    const [TradeData, setTradeData] = useState<TradeData[]>([]);


    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const api = new APIService();

    async function GetASingleCoin(api: APIService, product: string) {
        const res = await api.getCoinPriceHistory(product, '1')
        const resTradeHistory = await api.getTradeHistory(product, '1')
        setTradeData(resTradeHistory)
        setBtcPriceHistory(res)
    }



    const { setTheme } = useTheme()
    useEffect(() => {
        const fetchData = async () => {
            try {


                const resProducts = await api.fetchProducts();
                setProductsArray(resProducts);
                console.log('prods', products)
                await GetASingleCoin(api, resProducts[0].id)

                const resTradeHistory = await api.getTradeHistory(resProducts[0].id, '0')
                setTradeData(resTradeHistory)


            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    }, [toast]);
    return (
        <main>
            <Button
                onClick={() => {
                    toast({
                        title: "Scheduled: Catch up",
                        description: "Friday, February 10, 2023 at 5:57 PM",
                    })
                }}
            >
                Show Toast
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Card className='m-4'>
                <CardHeader>
                    <CardTitle>Historic {value} </CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                                {value
                                    ? value
                                    : "Select trading pair..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search trading pair..." />
                                <CommandEmpty>No trading pair found.</CommandEmpty>
                                <CommandGroup>
                                    {products.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.id}
                                            onSelect={async (currentValue) => {
                                                console.log(value)
                                                console.log(currentValue)
                                                setValue(currentValue === value ? "" : currentValue);

                                                await GetASingleCoin(api, currentValue)


                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === product.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {product.id}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>

                </CardHeader>
                <CardContent>
                    <HistoryChart priceHistory={btcPriceHistory} />
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>

            <Card className='m-4'>
                <TradeTable columns={columns} data={TradeData} />
            </Card>

        </main>

    )
}

export default MainPage

