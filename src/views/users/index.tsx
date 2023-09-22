import getCroppedImg from '@/lib/image-crop'
import { useState } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import throttle from '@/lib/throttle'
import ImageCropper from '@/components/custom/cropper'
import getCroppedImage from '@/lib/image-crop'

type ImageCropProps = {
  src: string | undefined
}
export default function ImageCropDemo({ src }: ImageCropProps) {
  const [crop, setCrop] = useState<Crop | undefined>(undefined)
  const [blob, setBlob] = useState<string | undefined>(undefined)

  const expensiveCalculation = throttle(async () => {
    const croppedImage =
      src && crop
        ? await getCroppedImage(src, crop, 0.8, 400, 300, false)
        : undefined
    if (croppedImage) {
      setBlob(croppedImage)
    }
  }, 100)

  return (
    <div className='flex'>
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
      </div>
      <ImageCropper />
    </div>
  )
}
