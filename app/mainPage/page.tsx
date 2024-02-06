"use client"

import Link from 'next/link'
import { Check, ChevronsUpDown, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import TradeTable from '../table/page'
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,

} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
// import { ColumnDef } from '@tanstack/react-table'
import APIService from '../api/cryptoCoinsService'
import { TradeData, PriceData, TradingPair } from '../interfaces/crypto'
//https://api.coinbase.com/v2/prices/BTC-USD/historic?days=76

export type TradeDataCol = {
    trade_id: number
    side: string
    size: number
    price: number
    time: string
}
export const columnsTable: ColumnDef<any>[] = [
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

const MainPage = () => {
    const { toast } = useToast()
    const [btcPriceHistory, setBtcPriceHistory] = useState<PriceData[]>([]);
    const [products, setProductsArray] = useState<TradingPair[]>([]);
    const [TradeData, setTradeData] = useState<TradeData[]>([]);


    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const api = new APIService();

    async function GetASingleCoin(api: APIService, product: string) {
        const priceHistory = await api.getCoinPriceHistory(product, '1')
        const resTradeHistory = await api.getTradeHistory(product, '1')
        setTradeData(resTradeHistory)
        setBtcPriceHistory(priceHistory)
        console.log('chart', priceHistory)
        console.log('type', btcPriceHistory)

    }

    // table
    const [sorting, setSorting] = React.useState<SortingState>([])

    const data = TradeData
    const columns = columnsTable
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
        },
    })


    //
    const { setTheme } = useTheme()
    useEffect(() => {
        const fetchData = async () => {
            try {


                const resProducts = await api.fetchProducts();
                setProductsArray(resProducts);
                await GetASingleCoin(api, resProducts[0].id)
                const resTradeHistory = await api.getTradeHistory(resProducts[0].id, '0')
                setTradeData(resTradeHistory)


            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('type', btcPriceHistory);
    }, [btcPriceHistory]);
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
                    {/* <HistoryChart priceHistory={btcPriceHistory} /> */}

                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            width={900}
                            height={250}
                            data={btcPriceHistory}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#051aff" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#230ec2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" interval={60} />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="price"
                                fill="url(#chartColor)" // Set fill color to primary color
                                name="BTC Price"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>

            <Card className='m-4'>
                {/* <TradeTable data={[{
                    "trade_id": 4287607,
                    "side": "buy",
                    "size": 39,
                    "price": 0.1268,
                    "time": "12/31/1969, 7:33:44 PM"
                }]} columns={columns} /> */}

                <div className="--radius --border">
                    <Table>
                        <TableHeader>
                            {table?.getHeaderGroups()?.map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table?.getRowModel()?.rows?.length ? (
                                table?.getRowModel()?.rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-end space-x-2 py-4 mx-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

        </main >

    )
}

export default MainPage

