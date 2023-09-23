import { ColumnDef } from '@tanstack/react-table'

import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { Badge } from '@/components/ui/badge'
//import { ActionsMenu } from './actions-menu'
import { ActionsList } from './actions-list'

export type Category = {
  _id: string
  name: string
}

export const columns: ColumnDef<Category>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = String(row.getValue('name'))

      return (
        <div className='flex gap-2'>
          <Badge>{name}</Badge>
          <div>{name}</div>
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original
      return <ActionsList category={category} />
    },
  },
]
