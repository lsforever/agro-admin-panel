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

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthHeader } from 'react-auth-kit'

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import ImageCropperOnly from '@/components/custom/image-crop-only'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

import { CropIcon } from 'lucide-react'

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

const allowedFileTypes = 'image/png, image/jpeg, image/x-png'

export default function Create() {
  const { toast } = useToast()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  /////////////////////////////////////////////////////////

  const authHeader = useAuthHeader()
  const header = authHeader()
  const queryClient = useQueryClient()

  /////////////////////////////////////////////////////////

  const [image, setImage] = useState<string | undefined>(undefined)
  const [blob, setBlob] = useState<string | undefined>(undefined)
  const [cropOpen, setCropOpen] = useState(false)

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onefile = event.target.files ? event.target.files[0] : undefined
    setImage(URL.createObjectURL(onefile!))
    setBlob(undefined)
  }

  const onBlobValueChange = (blob: string) => {
    //form.setValue('image', blob)
    setBlob(blob)
  }

  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////

  const mutation = useMutation({
    mutationFn: async (categoryData: unknown) => {
      const data = await axios.post('categories', categoryData, {
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

  async function transformData(data: CategoryFormValues) {
    const newFormData = new FormData()
    newFormData.append('name', data.name)
    const fetchBlob = await fetch(blob!).then((r) => r.blob())
    newFormData.append('image', fetchBlob, 'image.jpg')
    return newFormData
  }

  async function onSubmit(data: CategoryFormValues) {
    if (!blob) return
    const finalData = await transformData(data)
    mutation.mutate(finalData)

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

  return (
    <ScrollArea className='h-full w-full'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className='mb-20 w-max space-y-8 p-4'
        >
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

          <FormItem>
            <FormLabel htmlFor='crop-image'>Select Image</FormLabel>
            <div className='flex items-center gap-2'>
              <Input
                id='crop-image'
                name='Select Image'
                type='file'
                multiple={false}
                accept={allowedFileTypes}
                onChange={onImageChange}
              />
              <Dialog open={cropOpen} onOpenChange={setCropOpen}>
                <DialogTrigger asChild>
                  {image ? (
                    <Button className='w-[180px]' variant='secondary' size='sm'>
                      <CropIcon className='mr-2 h-4 w-4' />
                      Crop Image
                    </Button>
                  ) : null}
                </DialogTrigger>
                <DialogContent className='h-[500px] min-h-[500px] w-[800px] min-w-[800px] '>
                  {/* sm:max-w-[425px] */}
                  <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                    <DialogDescription>
                      Make changes to crop image here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <ImageCropperOnly
                      image={image}
                      setBlob={onBlobValueChange}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setCropOpen(false)}>Done</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className='pt-1'>
              {blob ? (
                <img
                  className='h-[300px] w-auto rounded-lg border-4'
                  alt='img'
                  src={blob}
                />
              ) : (
                <div className='flex h-[200px] w-auto items-center  justify-center  rounded-lg border-2'>
                  <p className='text-sm  text-muted-foreground'>
                    No Cropped Image
                  </p>
                </div>
              )}
            </div>
            <FormDescription id='image_select_help'>
              {/* SVG, PNG, JPG or GIF (MAX. 800x400px). */}
              PNG, JPG (MIN. 30x30px).
            </FormDescription>
          </FormItem>

          {mutation.isLoading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit'>Create</Button>
          )}
        </form>
      </Form>
    </ScrollArea>
  )
}
