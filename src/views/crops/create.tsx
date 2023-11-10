import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'

import { CropIcon, Check } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { useState } from 'react'
import ImageCropperOnly from '@/components/custom/image-crop-only'
import { Separator } from '@/components/ui/separator'

const allowedFileTypes = 'image/png, image/jpeg, image/x-png'
// const allowedFileTypesMarkdown = 'text/markdown'
const allowedFileTypesMarkdown = '.md'

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

const monthsList = [
  {
    id: 1,
    label: 'January',
  },
  {
    id: 2,
    label: 'February',
  },
  {
    id: 3,
    label: 'March',
  },
  {
    id: 4,
    label: 'April',
  },
  {
    id: 5,
    label: 'May',
  },
  {
    id: 6,
    label: 'June',
  },
  {
    id: 7,
    label: 'July',
  },
  {
    id: 8,
    label: 'August',
  },
  {
    id: 9,
    label: 'September',
  },
  {
    id: 10,
    label: 'October',
  },
  {
    id: 11,
    label: 'November',
  },
  {
    id: 12,
    label: 'December',
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
  image: z.string().min(1, { message: 'Image should not be empty' }),
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

export type CropType = CropFormValues & { _id: string }

// This can come from your database or API.
const defaultValues: Partial<CropFormValues> = {
  //name: 'xxxx',
  //botanical: 'xxxx',
  // varieties: [{ value: 'xxx' }],
  // factors: { zones: ['wet'] },
  factors: { zones: [] },
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
          //'Content-Type': 'multipart/form-data',
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
      //form.reset()
      //form.setValue('category', query.data?.data.data[0]._id)
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: 'Crop creation failed. Please retry... ' + error.message,
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

  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================

  const [monthState, setMonthState] = useState<{
    wet: number[]
    intermediate: number[]
    dry: number[]
  }>({
    wet: [],
    intermediate: [],
    dry: [],
  })

  // ===========================================================

  const [markdown, setMarkdown] = useState<File | undefined>(undefined)

  const [image, setImage] = useState<string | undefined>(undefined)
  const [blob, setBlob] = useState<string | undefined>(undefined)
  const [cropOpen, setCropOpen] = useState(false)

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onefile = event.target.files ? event.target.files[0] : undefined
    setImage(URL.createObjectURL(onefile!))
    setBlob(undefined)
  }

  const onBlobValueChange = (blob: string) => {
    form.setValue('image', blob)
    setBlob(blob)
  }

  // ===========================================================
  // ===========================================================

  async function transformData(data: CropFormValues) {
    const newData = {
      ...data,
      factors: {
        ...data.factors,
        zones: data.factors?.zones.map((zone) => ({
          zone,
          months: monthState[zone as keyof typeof monthState],
        })),
      },
      varieties: data.varieties.map((v) => v.value),
    }

    // if (newData.factors) {
    //   newData.factors.zones = newData.factors?.zones.map((zone) => {
    //     zone: zone
    //   })
    // }

    const newFormData = new FormData()
    newFormData.append('data', JSON.stringify(newData))

    const fetchBlob = await fetch(blob!).then((r) => r.blob())

    // const file = new File([fetchBlob], 'image.jpg', {
    //   type: fetchBlob.type,
    // })

    newFormData.append('image', fetchBlob, 'image.jpg')
    if (markdown) newFormData.append('markdown', markdown)
    //newFormData.append('image', file)
    return newFormData
  }

  async function onSubmit(data: CropFormValues) {
    if (!blob) return
    const finalData = await transformData(data)

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
    <ScrollArea className='mx-10 h-full w-full'>
      <div className='mr-10 mt-4 space-y-4'>
        <h3 className='text-lg font-medium'>Create Crop</h3>
        <p className='text-sm text-muted-foreground'>
          Enter details to create a crop. Please select unique name for each
          crop.
        </p>
        <Separator />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className='mb-20 w-max space-y-8 px-16 py-6'
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
                      {query.data?.data.data.docs.map(
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
                        <div className='flex-col'>
                          <FormItem
                            key={item.id}
                            className='flex flex-row items-start space-x-3 space-y-0 pb-2'
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
                          <div className='grid grid-cols-3 gap-4 px-10'>
                            {monthsList.map((month) => (
                              <div key={month.id}>
                                <Checkbox
                                  value={month.id}
                                  checked={monthState[
                                    item.id as keyof typeof monthState
                                  ].includes(month.id)}
                                  onCheckedChange={(checked) => {
                                    const mlist =
                                      monthState[
                                        item.id as keyof typeof monthState
                                      ]
                                    if (checked) {
                                      setMonthState({
                                        ...monthState,
                                        [item.id as keyof typeof monthState]: [
                                          ...mlist,
                                          month.id,
                                        ].sort(),
                                      })
                                    }
                                    // Case 2  : The user unchecks the box
                                    else {
                                      setMonthState({
                                        ...monthState,
                                        [item.id as keyof typeof monthState]:
                                          mlist
                                            .filter((e) => e !== month.id)
                                            .sort(),
                                      })
                                    }
                                  }}
                                />
                                <FormLabel className='pl-4 text-sm font-normal'>
                                  {month.label}
                                </FormLabel>
                              </div>
                            ))}
                          </div>
                        </div>
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
            render={() => (
              <FormItem>
                <FormLabel htmlFor='crop-markdown'>
                  Extra Details of Crop
                </FormLabel>
                <div className='flex items-center gap-2'>
                  <Input
                    id='crop-markdown'
                    name='Select File'
                    type='file'
                    multiple={false}
                    accept={allowedFileTypesMarkdown}
                    onChange={(event) => {
                      if (event.target.files && event.target.files[0]) {
                        setMarkdown(event.target.files[0])
                      }
                    }}
                  />
                </div>
                <FormDescription id='markdown_select_help'>
                  {/* SVG, PNG, JPG or GIF (MAX. 800x400px). */}
                  (.md) file type only - max 4mb.
                </FormDescription>
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
            <Button type='submit'>Create Crop</Button>
          )}
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
