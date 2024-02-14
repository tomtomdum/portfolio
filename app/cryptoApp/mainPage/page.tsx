"use client"
import { Check, ChevronsUpDown, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
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
import { TradeData, PriceData, TradingPair, columnsTable } from '../interfaces/crypto'
import HistoryChart from '../historyChart/page'
import { ScrollArea } from "@/components/ui/scroll-area"
//https://api.coinbase.com/v2/prices/BTC-USD/historic?days=76


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

    return (
        <main>
            <Card>
                {/* <Button
                    onClick={() => {
                        toast({
                            title: "Scheduled: Catch up",
                            description: "Friday, February 10, 2023 at 5:57 PM",
                        })
                    }}
                >
                    Show Toast
                </Button> */}

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
                <p>
                    Ce site a été fait dans le but d&apos;apprendre React et NextJs et risque de changer
                </p>
            </Card>

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

                                <ScrollArea className="h-[500px]">
                                    <CommandEmpty>No trading pair found.</CommandEmpty>
                                    <CommandGroup>
                                        {products.map((product) => (
                                            <CommandItem
                                                key={product.id}
                                                value={product.id}
                                                onSelect={async (currentValue) => {
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
                                </ScrollArea>

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

