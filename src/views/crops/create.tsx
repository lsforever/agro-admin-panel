import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthHeader } from 'react-auth-kit'

import Loading from '@/components/custom/loading'
import { Trash } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import UploadComponent from '@/components/custom/upload'
import { Label } from '@/components/ui/label'

const climateZones = [
  {
    id: 'wet',
    label: 'Wet Zone',
  },

  {
    id: 'intermediate',
    label: 'Intermediate Zone',
  },
  {
    id: 'dry',
    label: 'Dry Zone',
  },
]

const cropFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  category: z.string().length(24, {
    message: 'Category must be an ID.',
  }),
  image: z
    .instanceof(File)
    .refine((files) => files?.length == 1, 'File is required.'),
  botanical: z
    .string()
    .min(2, {
      message: 'Botanical name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Botanical name must not be longer than 30 characters.',
    }),

  varieties: z.array(
    z.object({
      value: z
        .string()
        .min(1, {
          message: 'Variety must be at least 1 characters.',
        })
        .max(30, {
          message: 'Variety must not be longer than 30 characters.',
        }),
    }),
  ),
  // .length(2, {
  //   message: 'Varieties should atleast have 2 items.',
  // }),

  // .transform((x) => {
  //   const a = x.map((y) => y.value)
  //   return a
  // }),

  factors: z
    .object({
      rainfall: z
        .object({
          min: z.coerce.number().nonnegative().optional(),
          //.union([z.string(), z.undefined()])
          //.positive()
          //.refine((x) => {})
          // .gte(1, {
          //     message: 'Rainfall range should be more than 0.',
          // }),
          max: z.coerce.number().nonnegative().optional(),
        })
        .optional(),
      zones: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: 'You have to select at least one item.',
      }),
      soil: z
        .object({
          min: z.coerce.number().nonnegative().optional(),
          max: z.coerce.number().nonnegative().optional(),
        })
        .optional(),
      duration: z
        .object({
          min: z.coerce.number().nonnegative().optional(),
          max: z.coerce.number().nonnegative().optional(),
        })
        .optional(),
    })
    .optional(),
  other: z
    .object({
      extra: z
        .string()
        .url({ message: 'Please enter a valid URL.' })
        .optional(),
      //   z
      //     .preprocess(
      //       (e) => {
      //         e === '' ? undefined : e
      //       },
      //       z.string().url({ message: 'Please enter a valid URL.' }),
      //     )
      //     .optional(),
      //.union([z.string(), z.undefined()])
      //.transform((e) => (e === '' ? undefined : e))
      //.pipe(z.any())
      tutorials: z
        .array(
          z.object({
            name: z
              .string()
              .min(2, {
                message: 'Name must be at least 2 characters.',
              })
              .max(30, {
                message: 'Name must not be longer than 30 characters.',
              }),
            value: z.string().url({ message: 'Please enter a valid URL.' }),
          }),
        )
        .optional(),
      videos: z
        .array(
          z.object({
            name: z
              .string()
              .min(2, {
                message: 'Name must be at least 2 characters.',
              })
              .max(30, {
                message: 'Name must not be longer than 30 characters.',
              }),
            value: z.string().url({ message: 'Please enter a valid URL.' }),
          }),
        )
        .optional(),
    })
    .optional(),
  //   bio: z.string().max(160).min(4),
  //   urls: z
  //     .array(
  //       z.object({
  //         value: z.string().url({ message: "Please enter a valid URL." }),
  //       }),
  //     )
  //     .optional(),
})

type CropFormValues = z.infer<typeof cropFormSchema>

// This can come from your database or API.
const defaultValues: Partial<CropFormValues> = {
  name: 'xxxx',
  botanical: 'xxxx',
  varieties: [{ value: 'xxx' }],
  factors: { zones: ['wet'] },

  //bio: "I own a computer.",
  //factors: { rainfall: { min: 0, max: 0 } },
  //   urls: [
  //     { value: "https://shadcn.com" },
  //     { value: "http://twitter.com/shadcn" },
  //   ],
}

export default function Create() {
  const { toast } = useToast()

  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  /////////////////////////////////////////////////////////

  const authHeader = useAuthHeader()
  const header = authHeader()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await axios.get('categories', {
        headers: { Authorization: header },
      })
      return data
    },
    keepPreviousData: true,
    staleTime: Infinity,
  })

  const mutation = useMutation({
    mutationFn: async (cropData: unknown) => {
      const data = await axios.post('crops', cropData, {
        headers: {
          Authorization: header,
        },
      })
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['crops'] })
      toast({
        title: 'Crop Created',
        description: 'Crop creation successfull...',
      })
      form.reset()
      //form.setValue('category', query.data?.data.data[0]._id)
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Crop creation failed. Please retry...',
      })
    },
  })
  //////////////////////////////////////////////////////////

  //   const { fields: fieldsURL, append: appendURL } = useFieldArray({
  //     name: "urls",
  //     control: form.control,
  //   });

  const {
    fields: fieldsVarieties,
    append: appendVarieties,
    remove: removeVarieties,
  } = useFieldArray({
    name: 'varieties',
    control: form.control,
  })

  const {
    fields: fieldsTutorials,
    append: appendTutorials,
    remove: removeTutorials,
  } = useFieldArray({
    name: 'other.tutorials',
    control: form.control,
  })

  const {
    fields: fieldsVideos,
    append: appendVideos,
    remove: removeVideos,
  } = useFieldArray({
    name: 'other.videos',
    control: form.control,
  })

  function transformData(data: CropFormValues) {
    const newData = {
      ...data,
      varieties: data.varieties.map((v) => v.value),
    }
    return newData
  }

  function onSubmit(data: CropFormValues) {
    const finalData = transformData(data)
    mutation.mutate(finalData)
    toast({
      title: 'Creating a crop',
      description: 'Please wait. Crop will be created soon',
    })
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>
    //         {JSON.stringify(finalData, null, 2)}
    //       </code>
    //     </pre>
    //   ),
    // })
  }

  function onError() {
    toast({
      title: 'Incomplete Form',
      description: 'Complete the form data before submit',
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Crop Name' {...field} />
                </FormControl>
                <FormDescription>
                  This is the general name of the crop. This is not the
                  botanical name. Also don't include variety names here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                {query.isLoading && <Loading />}
                {query.isError && 'Error'}
                {query.isSuccess && (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category for the crop' />
                      </SelectTrigger>
                    </FormControl>

                    {/* <SelectContent>
                                        <SelectItem value='64dbeac4c84d7b5eb71b4cb1'>
                                            Vegetables
                                        </SelectItem>
                                        <SelectItem value='64dbeac4c84d7b5eb71b4cb2'>
                                            m@support.com
                                        </SelectItem>
                                        <SelectItem value='64dbeac4c84d7b5eb71b4cb3'>
                                            m@support.com
                                        </SelectItem>
                                    </SelectContent> */}

                    <SelectContent>
                      {query.data?.data.data.map(
                        (category: { _id: string; name: string }) => {
                          return (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          )
                        },
                      )}
                    </SelectContent>
                  </Select>
                )}
                <FormDescription>
                  You can manage above list through
                  <Link to='/categories' className='ml-2 text-primary'>
                    Crop Categories
                  </Link>
                  .
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='botanical'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Botanical Name</FormLabel>
                <FormControl>
                  <Input placeholder='Botanical Name' {...field} />
                </FormControl>
                <FormDescription>
                  This is the botanical name of the crop
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormItem>
              <FormLabel>Varieties</FormLabel>
              <FormDescription>Add varieties for the crop.</FormDescription>
              {fieldsVarieties.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`varieties.${index}.value`}
                  //name={`varieties.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel
                                            className={cn(
                                                index !== 0 && 'sr-only'
                                            )}
                                        >
                                            Varieties
                                        </FormLabel>
                                        <FormDescription
                                            className={cn(
                                                index !== 0 && 'sr-only'
                                            )}
                                        >
                                            Add varieties for the crop.
                                        </FormDescription> */}

                      <div className='flex items-center'>
                        <FormControl>
                          <Input placeholder='Variety' {...field} />
                        </FormControl>
                        <Button
                          variant='outline'
                          size='icon'
                          className='ml-2 h-9 w-9'
                          onClick={() => removeVarieties(index)}
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </FormItem>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='mt-2'
              onClick={() => appendVarieties({ value: '' })}
            >
              Add Varieties
            </Button>
          </div>
          <FormItem>
            <FormLabel>Rainfall Range</FormLabel>
            <FormField
              control={form.control}
              name={`factors.rainfall.min`}
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input placeholder='Mininum' type='number' {...field} />
                  </FormControl>
                  {/* <FormDescription>Minimum Rainfall.</FormDescription> */}
                  <FormMessage />
                </>
              )}
            />

            <FormField
              control={form.control}
              name={`factors.rainfall.max`}
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input placeholder='Maximum' type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Amount of rainfall range needed for the crop.
                  </FormDescription>
                </>
              )}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Soil PH Range</FormLabel>
            <FormField
              control={form.control}
              name={`factors.soil.min`}
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input placeholder='Mininum' type='number' {...field} />
                  </FormControl>
                  {/* <FormDescription>Minimum Rainfall.</FormDescription> */}
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name={`factors.soil.max`}
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input placeholder='Maximum' type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Amount of soil PH range needed for the crop.
                  </FormDescription>
                </>
              )}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Crop Duration</FormLabel>
            <FormField
              control={form.control}
              name={`factors.duration.min`}
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input placeholder='Mininum' type='number' {...field} />
                  </FormControl>
                  {/* <FormDescription>Minimum Rainfall.</FormDescription> */}
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name={`factors.duration.max`}
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input placeholder='Maximum' type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Amount of days needed for the crop to yeild harvest.
                  </FormDescription>
                </>
              )}
            />
          </FormItem>
          <FormField
            control={form.control}
            name='factors.zones'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel className='text-base'>Climate Zones</FormLabel>
                  <FormDescription>
                    Select the suitable climate zones for the crop.
                  </FormDescription>
                </div>
                {climateZones.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name='factors.zones'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className='flex flex-row items-start space-x-3 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className='text-sm font-normal'>
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='other.extra'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extra Details of Crop</FormLabel>
                <FormControl>
                  <Input placeholder='Extra details link' {...field} />
                </FormControl>
                <FormDescription>
                  Add the link to a markdown file that contains extra details
                  about the crop.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <div>
              <FormLabel>Tutorials</FormLabel>
              <FormDescription>Add tutorials for the crop.</FormDescription>

              {fieldsTutorials.map((field, index) => (
                <FormItem key={field.id}>
                  <div className='flex flex-row items-start justify-center gap-2 p-1'>
                    <FormField
                      control={form.control}
                      //key={field.id}
                      name={`other.tutorials.${index}.name`}
                      render={({ field }) => (
                        <div className=' basis-1/4 '>
                          <FormControl>
                            <Input placeholder='Name' {...field} />
                          </FormControl>

                          <FormMessage />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      //key={field.id}
                      name={`other.tutorials.${index}.value`}
                      render={({ field }) => (
                        <div className=' basis-3/4'>
                          <FormControl>
                            <Input placeholder='Link' {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      )}
                    />
                    <Button
                      variant='outline'
                      size='icon'
                      type='button'
                      className='ml-2 h-9 w-9'
                      onClick={() => removeTutorials(index)}
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </FormItem>
              ))}
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='mt-2'
              onClick={() => appendTutorials({ name: '', value: '' })}
            >
              Add Tutorials
            </Button>
          </div>
          <div>
            <div>
              <FormLabel>Videos</FormLabel>
              <FormDescription>Add videos for the crop.</FormDescription>

              {fieldsVideos.map((field, index) => (
                <FormItem key={field.id}>
                  <div className='flex flex-row items-start justify-center gap-2 p-1'>
                    <FormField
                      control={form.control}
                      //key={field.id}
                      name={`other.videos.${index}.name`}
                      render={({ field }) => (
                        <div className=' basis-1/4 '>
                          <FormControl>
                            <Input placeholder='Name' {...field} />
                          </FormControl>

                          <FormMessage />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      //key={field.id}
                      name={`other.videos.${index}.value`}
                      render={({ field }) => (
                        <div className=' basis-3/4'>
                          <FormControl>
                            <Input placeholder='Link' {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      )}
                    />
                    <Button
                      variant='outline'
                      size='icon'
                      type='button'
                      className='ml-2 h-9 w-9'
                      onClick={() => removeVideos(index)}
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </FormItem>
              ))}
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='mt-2'
              onClick={() => appendVideos({ name: '', value: '' })}
            >
              Add Videos
            </Button>
          </div>
          {/* <Button
            onClick={() => {
              form.setValue('factors.zones', ['dry'], { shouldValidate: true })
            }}
          >
            zzzzze
          </Button> */}
          {mutation.isLoading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit'>Update profile</Button>
          )}

          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extra Details of Crop</FormLabel>
                <FormControl>
                  {/* <Input type='file' placeholder='Select File' {...field} /> */}
                </FormControl>
                <FormDescription>
                  Add the link to a markdown file that contains extra details
                  about the crop.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel htmlFor='file_input'>Upload file</FormLabel>
            <Input
              aria-describedby='file_input_help'
              id='file_input'
              type='file'
            />
            <FormDescription id='file_input_help'>
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </FormDescription>
          </FormItem>

          {/* <Button type='submit'>Update profile</Button> */}
          {/* <Button disabled>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button> */}
          {/* <UploadComponent /> */}
        </form>
      </Form>
    </ScrollArea>
  )
}

{
  /* <FormField
control={form.control}
name="bio"
render={({ field }) => (
  <FormItem>
    <FormLabel>Bio</FormLabel>
    <FormControl>
      <Textarea
        placeholder="Tell us a little bit about yourself"
        className="resize-none"
        {...field}
      />
    </FormControl>
    <FormDescription>
      You can <span>@mention</span> other users and organizations to
      link to them.
    </FormDescription>
    <FormMessage />
  </FormItem>
)}
/>
<div>
{fieldsURL.map((field, index) => (
  <FormField
    control={form.control}
    key={field.id}
    name={`urls.${index}.value`}
    render={({ field }) => (
      <FormItem>
        <FormLabel className={cn(index !== 0 && "sr-only")}>
          URLs
        </FormLabel>
        <FormDescription className={cn(index !== 0 && "sr-only")}>
          Add links to your website, blog, or social media profiles.
        </FormDescription>

        <FormControl>
          <Input {...field} />
        </FormControl>

        <FormMessage />
      </FormItem>
    )}
  />
))}
<Button
  type="button"
  variant="outline"
  size="sm"
  className="mt-2"
  onClick={() => appendURL({ value: "" })}
>
  Add URL
</Button>
</div> */
}
