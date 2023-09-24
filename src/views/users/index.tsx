import getCroppedImage from '@/lib/image-crop'
import { useState } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import throttle from '@/lib/throttle'
import ImageCropper from '@/components/custom/image-crop'
import { Input } from '@/components/ui/input'

type ImageCropProps = {
  src: string | undefined
}
export default function ImageCropDemo({ src }: ImageCropProps) {
  const [crop, setCrop] = useState<Crop | undefined>(undefined)
  const [blob, setBlob] = useState<string | undefined>(undefined)

  return (
    <div className='flex'>
      {/* <Input type='file' />
      <ReactCrop
        className='flex-basis-1'
        crop={crop}
        keepSelection={true}
        aspect={4 / 3}
        onChange={(c) => {
          setCrop(c)
          expensiveCalculation()
        }}
      >
        <img alt={'img'} src={src} />
      </ReactCrop>
      <div className='h-[300px] w-[400px] bg-red-200'>
        <img src={blob} alt='aaa' className='h-min w-min' />
      </div> */}
      <ImageCropper />
    </div>
  )
}
