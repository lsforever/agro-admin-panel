import { useRef, useState } from 'react'
import ReactCrop, {
  //Crop,
  centerCrop,
  makeAspectCrop,
  //PixelCrop,
  convertToPixelCrop,
  PercentCrop,
} from 'react-image-crop'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import getCroppedImage from '@/lib/image-crop'

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const maxExportDimentions = { width: 600, height: 450 }
const aspect = 4 / 3

export default function ImageCropper() {
  const allowedFileTypes = 'image/png, image/jpeg, image/x-png'

  const [image, setImage] = useState<string | undefined>(undefined)
  const [percentCrop, setPercentCrop] = useState<PercentCrop | undefined>(
    undefined,
  )
  const [blob, setBlob] = useState<string | undefined>(undefined)

  const imgRef = useRef<HTMLImageElement>(null)

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onefile = event.target.files ? event.target.files[0] : undefined
    setImage(URL.createObjectURL(onefile!))
  }

  const onImageLoaded = (event: React.ChangeEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = event.currentTarget
      //const { naturalWidth, naturalHeight } = event.currentTarget
      //setPercentCrop(centerAspectCrop(naturalWidth, naturalHeight, aspect))
      setPercentCrop(centerAspectCrop(width, height, aspect))
    }

    // const width = event.currentTarget.naturalHeight
    // const height = event.currentTarget.naturalHeight
    // const low = width > height ? height : width
    // const part = Math.floor(low / 5)
    // setCrop({
    //   unit: 'px',
    //   height: part * 3,
    //   width: part * 4,
    //   x: part,
    //   y: part,
    // })
  }

  const onCropComplete = async () => {
    //const onCropComplete = async (crop: Crop) => {}
    if (!image) return

    const convertedPixelCrop = convertToPixelCrop(
      percentCrop!,
      imgRef.current!.naturalWidth,
      imgRef.current!.naturalHeight,
    )

    console.log(convertedPixelCrop)
    const croppedImage = await getCroppedImage(
      image!,
      convertedPixelCrop,
      0.8,
      // 400,
      // 300,
      maxExportDimentions.width,
      maxExportDimentions.height,
      false,
    )
    if (croppedImage) {
      setBlob(croppedImage)
    }
  }

  return (
    <div>
      <Label htmlFor='upload-image'>
        <Input
          id='upload-image'
          name='upload photo'
          type='file'
          multiple={false}
          accept={allowedFileTypes}
          onChange={onImageChange}
        />
        <Button variant='outline'>aaa</Button>
      </Label>
      <div className='flex flex-shrink-0 flex-grow-0'>
        <div className='shrink-0 grow-0'>
          <ReactCrop
            className='h-auto w-[300px]'
            crop={percentCrop}
            keepSelection={true}
            aspect={aspect}
            onComplete={onCropComplete}
            onChange={(_, percentCrop) => setPercentCrop(percentCrop)}
            ruleOfThirds={true}
            minWidth={30}
            minHeight={30}
          >
            <img ref={imgRef} alt='img' src={image} onLoad={onImageLoaded} />
          </ReactCrop>
        </div>
        <div className='shrink-0 grow-0'>
          <img className='h-auto w-[300px]' alt={'crop'} src={blob} />
        </div>
      </div>
    </div>
  )
}
