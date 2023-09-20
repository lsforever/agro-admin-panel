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
  const [crop, setCrop] = useState<Crop>()
  const [blob, setBlob] = useState()

  // const showCroppedImage = async () => {
  //   try {
  //     const croppedImage = await getCroppedImg(src, crop)
  //     //console.log('done', { croppedImage })
  //     setBlob(croppedImage)
  //     //setCroppedImage(croppedImage)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  const expensiveCalculation = throttle(async () => {
    const croppedImage = await getCroppedImage(src, crop, 0.8, 400, 300, true)
    //console.log('done', { croppedImage })
    setBlob(croppedImage)
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
          //showCroppedImage()
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
