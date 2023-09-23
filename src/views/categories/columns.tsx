import { ColumnDef } from '@tanstack/react-table'
import {
  MoreHorizontal,
  ArrowUpDown,
  Trash,
  Pencil,
  Eye,
  Copy,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

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
      return <Actions category={category} />
    },
  },
]

export const Actions = ({ category }: { category: Category }) => {
  const [alertOpen, setAlertOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const [sheetOpen, setSheetOpen] = useState(false)

  function handleAlertOpen(open: boolean) {
    setAlertOpen(open)
    if (open === false) {
      setDropOpen(false)
    }
  }
  function handleSheetOpen(open: boolean) {
    setSheetOpen(open)
    if (open === false) {
      setDropOpen(false)
    }
  }

  const authHeader = useAuthHeader()
  const header = authHeader()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      const data = await axios.delete(`categories/${category._id}`, {
        headers: {
          Authorization: header,
        },
      })
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] })

      toast({
        title: 'Success',
        description: (
          <Alert variant='default' className='w-[22rem]'>
            <CheckCircle2 className=' h-4 w-4 ' />
            <AlertTitle>Data Removed</AlertTitle>
            <AlertDescription>Category deleted successfully.</AlertDescription>
          </Alert>
        ),
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Category creation failed. Please retry...',
      })
    },
  })
  function handleDeleteCategory() {
    mutation.mutate()

    toast({
      title: 'Loading ...',
      description: (
        <Alert variant='default' className='w-[22rem]'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          <AlertTitle>Category Delete</AlertTitle>
          <AlertDescription>
            Please wait. Category will be deleted soon.
          </AlertDescription>
        </Alert>
      ),
    })
  }

  return (
    <DropdownMenu open={dropOpen} onOpenChange={setDropOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' hidden={alertOpen}>
        {/* <DropdownMenuContent align='end'> */}
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(category._id)}
        >
          Copy ID
          <DropdownMenuShortcut>
            <Copy className='h-4 w-4' />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <Sheet open={sheetOpen} onOpenChange={handleSheetOpen}>
          <SheetTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
              }}
            >
              View
              <DropdownMenuShortcut>
                <Eye className='h-4 w-4' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Category Details</SheetTitle>
              <Separator className='my-4 p-1' />
              <h4 className='pt-4 text-sm font-medium tracking-tight'>
                Category ID
              </h4>
              <p className='text-sm text-muted-foreground'>{category._id}</p>
              <h4 className='text-sm font-medium tracking-tight'>
                Category Name
              </h4>
              <p className='pb-4 text-sm text-muted-foreground'>
                {category.name}
              </p>
              <Separator className='my-4' />
              <SheetDescription>
                This can be edited through edit page
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        {/* <DropdownMenuItem>
          View
          <DropdownMenuShortcut>
            <Eye className='h-4 w-4' />
          </DropdownMenuShortcut>
        </DropdownMenuItem> */}

        <Link to={`edit/${category._id}`}>
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>
              <Pencil className='h-4 w-4' />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>

        <AlertDialog open={alertOpen} onOpenChange={handleAlertOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
              }}
            >
              Delete
              <DropdownMenuShortcut>
                <Trash className='h-4 w-4' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                selected category and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
