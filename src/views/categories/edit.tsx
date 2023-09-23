import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useToast } from '@/components/ui/use-toast'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthHeader } from 'react-auth-kit'

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useForm } from 'react-hook-form'

import { useParams } from 'react-router-dom'
import Loading from '@/components/custom/loading'
import { useEffect } from 'react'

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    })
    .regex(/^[A-Z]/, 'First letter Should be capital.')
    .trim(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

// This can come from your database or API.
const defaultValues: Partial<CategoryFormValues> = {}

export default function Edit() {
  const { categoryId } = useParams()

  const { toast } = useToast()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  /////////////////////////////////////////////////////////

  const { isLoading, isError, error, isFetching, data } = useQuery({
    queryKey: ['categories', categoryId],
    queryFn: async () => {
      const data = await axios.get(`categories/${categoryId}`, {
        headers: { Authorization: header },
      })
      return data
    },
    keepPreviousData: true,
    staleTime: Infinity,
  })

  /////////////////////////////////////////////////////////

  const authHeader = useAuthHeader()
  const header = authHeader()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (categoryData: unknown) => {
      const data = await axios.post(`categories/${categoryId}`, categoryData, {
        headers: {
          Authorization: header,
        },
      })
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      //   toast({
      //     title: 'Category Created',
      //     description: 'Category creation successfull...',
      //   })

      toast({
        //variant: 'destructive',
        title: 'Success',
        description: (
          <Alert variant='default' className='w-[22rem]'>
            <CheckCircle2 className=' h-4 w-4 ' />
            <AlertTitle>Data added</AlertTitle>
            <AlertDescription>Category created successfully.</AlertDescription>
          </Alert>
        ),
      })

      form.reset()
      form.setValue('name', '')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Category creation failed. Please retry...',
      })
    },
  })

  //////////////////////////////////////////////////////////

  //   function transformData(data: CategoryFormValues) {
  //     const newData = {
  //       ...data,
  //       varieties: data.varieties.map((v) => v.value),
  //     }
  //     return newData
  //   }

  function onSubmit(data: CategoryFormValues) {
    //const finalData = transformData(data)
    mutation.mutate(data)

    // toast({
    //   title: 'Creating a crop',
    //   description: 'Please wait. Crop will be created soon',
    // })

    toast({
      //variant: 'destructive',
      title: 'Loading ...',
      description: (
        <Alert variant='default' className='w-[22rem]'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          <AlertTitle>Category Create</AlertTitle>
          <AlertDescription>
            Please wait. Category will be created soon.
          </AlertDescription>
        </Alert>
      ),
    })
  }

  function onError() {
    // toast({
    //   title: 'Incomplete Form',
    //   description: 'Complete the form data before submit',
    // })
    // toast({
    //   //variant: 'destructive',
    //   title: 'Empty Form',
    //   description: (
    //     <Alert variant='destructive'>
    //       <AlertCircle className='h-4 w-4' />
    //       <AlertTitle>Empty Fields</AlertTitle>
    //       <AlertDescription>
    //         Please fill all fields before trying.
    //       </AlertDescription>
    //     </Alert>
    //   ),
    // })

    toast({
      //variant: 'destructive',

      description: (
        <Alert variant='destructive' className='w-[22rem]'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Empty Form</AlertTitle>
          <AlertDescription>
            Please fill all fields before trying.
          </AlertDescription>
        </Alert>
      ),
    })
  }

  const categoryName = data?.data.data.name
  useEffect(() => {
    form.setValue('name', categoryName)
  }, [data, categoryName, form])

  if (isLoading || isFetching) return <Loading />
  if (isError) return 'An error has occurred: ' + error

  return (
    <ScrollArea className='h-full w-full'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className='mb-20 w-max space-y-8 p-4'
        >
          <FormItem>
            <FormLabel>Category ID</FormLabel>
            <Input type='text' disabled={true} value={categoryId} />
            <FormDescription>ID of the category to be edited</FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder='Category Name' {...field} />
                </FormControl>
                <FormDescription>
                  This is the general name of the category. This should be
                  unique name. ( Unqiueness check will be added ... )
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {mutation.isLoading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit'>Edit Category</Button>
          )}
        </form>
      </Form>
    </ScrollArea>
  )
}
