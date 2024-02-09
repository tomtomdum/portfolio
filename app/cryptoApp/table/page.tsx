"use client"
import React, { useEffect } from 'react';

import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function DataTable<TData, TValue>({ columns, data, }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })


    useEffect(() => {

        console.log('table:', data);
        console.log('grouph', table?.getHeaderGroups())

        table?.getHeaderGroups()?.map((headerGroup) => {
            console.log(headerGroup.headers)
        });


    }, [data]); // Log the data whenever it changes
    return (
        <div>
            {/* {table?.getHeaderGroups()?.map((headerGroup, index) => (
                <div key={index}>
                    {headerGroup}
                </div>
            ))} */}
        </div>
        // <div className="--radius --border">
        //     <Table>
        //         <TableHeader>
        //             {table?.getHeaderGroups()?.map((headerGroup) => (
        //                 <TableRow key={headerGroup.id}>
        //                     {headerGroup.headers.map((header) => {
        //                         return (
        //                             <TableHead key={header.id}>
        //                                 {header.isPlaceholder
        //                                     ? null
        //                                     : flexRender(
        //                                         header.column.columnDef.header,
        //                                         header.getContext()
        //                                     )}
        //                             </TableHead>
        //                         )
        //                     })}
        //                 </TableRow>
        //             ))}

        //         </TableHeader>
        //         <TableBody>
        //             {table?.getRowModel()?.rows?.length ? (
        //                 table?.getRowModel()?.rows?.map((row) => (
        //                     <TableRow
        //                         key={row.id}
        //                         data-state={row.getIsSelected() && "selected"}
        //                     >
        //                         {row.getVisibleCells().map((cell) => (
        //                             <TableCell key={cell.id}>
        //                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
        //                             </TableCell>
        //                         ))}
        //                     </TableRow>
        //                 ))
        //             ) : (
        //                 <TableRow>
        //                     <TableCell colSpan={columns.length} className="h-24 text-center">
        //                         No results.
        //                     </TableCell>
        //                 </TableRow>
        //             )}
        //         </TableBody>
        //     </Table>
        //     <div className="flex items-center justify-end space-x-2 py-4 mx-4">
        //         <Button
        //             variant="outline"
        //             size="sm"
        //             onClick={() => table.previousPage()}
        //             disabled={!table.getCanPreviousPage()}
        //         >
        //             Previous
        //         </Button>
        //         <Button
        //             variant="outline"
        //             size="sm"
        //             onClick={() => table.nextPage()}
        //             disabled={!table.getCanNextPage()}
        //         >
        //             Next
        //         </Button>
        //     </div>
        // </div>
    )
}