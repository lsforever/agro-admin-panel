import {
    ColumnDef,
    flexRender,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    //Pagination,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

import PaginationMenu from '@/components/custom/pagination'
// import { Moon, Sun } from 'lucide-react'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    totalCount: number
    pageSize: number
    currentPage: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}
// import { Table as Tablez } from '@tanstack/react-table'
// interface DataTablePaginationProps<TData> {
//     table: Tablez<TData>
// }

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { useNavigate } from 'react-router-dom'

export function DataTable<TData, TValue>({
    columns,
    data,
    totalCount,
    pageSize,
    currentPage,
    onPageChange,
    onLimitChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    )
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        manualPagination: true,
    })

    const navigate = useNavigate()

    return (
        <div>
            <div className='flex items-center justify-between py-4'>
                <Input
                    id='filter-name'
                    placeholder='Filter by name...'
                    value={
                        (table.getColumn('name')?.getFilterValue() as string) ??
                        ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('name')
                            ?.setFilterValue(event.target.value)
                    }
                    className='max-w-sm'
                />
                <div className='flex '>
                    <Button
                        variant='outline'
                        className='ml-auto mr-4'
                        onClick={() => {
                            navigate('create')
                        }}
                    >
                        Create
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' className='ml-auto'>
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className='capitalize'
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4 '>
                <div className='flex-1 text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                {/* <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button> */}

                <div className='flex items-center space-x-2'>
                    <p className='text-sm font-medium'>Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                            onLimitChange(Number(value))
                        }}
                    >
                        <SelectTrigger className='h-8 w-[70px]'>
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side='top'>
                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <PaginationMenu
                    onPageChange={(page) => {
                        onPageChange(Number(page))
                    }}
                    siblingCount={1}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    //className='text-primary'
                />
            </div>
        </div>
    )
}

// export function DataTablePagination<TData>({
//     table,
// }: DataTablePaginationProps<TData>) {
//     return (
//         <div className='flex items-center justify-between px-2'>
//             <div className='flex-1 text-sm text-muted-foreground'>
//                 {table.getFilteredSelectedRowModel().rows.length} of{' '}
//                 {table.getFilteredRowModel().rows.length} row(s) selected.
//             </div>
//             <div className='flex items-center space-x-6 lg:space-x-8'>
//                 <div className='flex items-center space-x-2'>
//                     <p className='text-sm font-medium'>Rows per page</p>
//                     <Select
//                         value={`${table.getState().pagination.pageSize}`}
//                         onValueChange={(value) => {
//                             table.setPageSize(Number(value))
//                         }}
//                     >
//                         <SelectTrigger className='h-8 w-[70px]'>
//                             <SelectValue
//                                 placeholder={
//                                     table.getState().pagination.pageSize
//                                 }
//                             />
//                         </SelectTrigger>
//                         <SelectContent side='top'>
//                             {[10, 20, 30, 40, 50].map((pageSize) => (
//                                 <SelectItem
//                                     key={pageSize}
//                                     value={`${pageSize}`}
//                                 >
//                                     {pageSize}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
//                     Page {table.getState().pagination.pageIndex + 1} of{' '}
//                     {table.getPageCount()}
//                 </div>
//                 <div className='flex items-center space-x-2'>
//                     <Button
//                         variant='outline'
//                         className='hidden h-8 w-8 p-0 lg:flex'
//                         onClick={() => table.setPageIndex(0)}
//                         disabled={!table.getCanPreviousPage()}
//                     >
//                         <span className='sr-only'>Go to first page</span>
//                         <Sun className='h-4 w-4' />
//                     </Button>
//                     <Button
//                         variant='outline'
//                         className='h-8 w-8 p-0'
//                         onClick={() => table.previousPage()}
//                         disabled={!table.getCanPreviousPage()}
//                     >
//                         <span className='sr-only'>Go to previous page</span>
//                         <Moon className='h-4 w-4' />
//                     </Button>
//                     <Button
//                         variant='outline'
//                         className='h-8 w-8 p-0'
//                         onClick={() => table.nextPage()}
//                         disabled={!table.getCanNextPage()}
//                     >
//                         <span className='sr-only'>Go to next page</span>
//                         <Moon className='h-4 w-4' />
//                     </Button>
//                     <Button
//                         variant='outline'
//                         className='hidden h-8 w-8 p-0 lg:flex'
//                         onClick={() =>
//                             table.setPageIndex(table.getPageCount() - 1)
//                         }
//                         disabled={!table.getCanNextPage()}
//                     >
//                         <span className='sr-only'>Go to last page</span>
//                         <Sun className='h-4 w-4' />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }
