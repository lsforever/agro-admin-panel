import { Category } from './columns'

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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthHeader } from 'react-auth-kit'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Trash, Pencil, Eye, Copy, Loader2, CheckCircle2 } from 'lucide-react'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import { API_IMAGE_BASE_URL } from '@/lib/config'

export const ActionsList = ({ category }: { category: Category }) => {
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
      queryClient.invalidateQueries({ queryKey: ['crops'] })
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
        description: 'Category delete failed. Please retry...',
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
    <div className='mr-4 flex place-content-end gap-2'>
      <Button
        className='h-8 w-8'
        variant='outline'
        size='icon'
        onClick={() => {
          navigator.clipboard.writeText(category._id)
          toast({
            title: 'Copied',
            description: `Category ID copied to clipboard - ${category._id}`,
          })
        }}
      >
        <Copy className=' h-4 w-4' />
        {/* Copy ID */}
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='h-8 w-8' variant='outline' size='icon'>
            <Eye className=' h-4 w-4' />
            {/* View */}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Category Details</SheetTitle>
            <SheetDescription>
              This can be edited through edit page
            </SheetDescription>
          </SheetHeader>

          <div className='mt-6 py-4'>
            <div>
              <div className='text-sm'>Category ID</div>
              <div className='p-2 text-sm text-muted-foreground'>
                {category._id}
              </div>
            </div>

            <Separator className='my-2' />

            <div>
              <div className='text-sm'>Category Name</div>
              <div className='p-2 text-sm text-muted-foreground'>
                {category.name}
              </div>
            </div>
          </div>

          <div>
            <div className='text-sm'>Crop Image</div>
            <div className='mt-1 p-4'>
              <img
                className='rounded-lg border'
                src={`${API_IMAGE_BASE_URL}${category.image}`}
                alt='crop image'
              />
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant='secondary'>Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* <Link to={`edit/${category._id}`}>
        <Pencil className='h-4 w-4' />
        Edit
      </Link> */}

      <Link to={`edit/${category._id}`}>
        <Button className='h-8 w-8' variant='outline' size='icon'>
          <Pencil className='h-4 w-4' />
          {/* Edit */}
        </Button>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='h-8 w-8' variant='outline' size='icon'>
            <Trash className='h-4 w-4' />
            {/* Delete */}
          </Button>
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
    </div>
  )
}
