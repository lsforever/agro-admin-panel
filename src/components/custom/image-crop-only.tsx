import { useRef, useState } from 'react'
import ReactCrop, {
  //Crop,
  centerCrop,
  makeAspectCrop,
  //PixelCrop,
  convertToPixelCrop,
  PercentCrop,
} from 'react-image-crop'
import getCroppedImage from '@/lib/image-crop'
import { cn } from '@/lib/utils'

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

// type ImageCropperOnlyType = {
//   image: string | undefined
//   setBlob: React.Dispatch<React.SetStateAction<string | undefined>>
// } & React.HTMLAttributes<HTMLDivElement>
type ImageCropperOnlyType = {
  image: string | undefined
  setBlob: (blob: string) => void
} & React.HTMLAttributes<HTMLDivElement>

export default function ImageCropperOnly({
  className,
  image,
  setBlob,
}: ImageCropperOnlyType) {
  const [percentCrop, setPercentCrop] = useState<PercentCrop | undefined>(
    undefined,
  )
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoaded = (event: React.ChangeEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = event.currentTarget
      setPercentCrop(centerAspectCrop(width, height, aspect))
    }
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
      maxExportDimentions.width,
      maxExportDimentions.height,
      false,
    )
    if (croppedImage) {
      setBlob(croppedImage)
    }
  }

  return (
    <div
      className={cn(
        'flex h-[345px] w-full items-center justify-center',
        className,
      )}
    >
      <ReactCrop
        className='h-auto w-auto'
        crop={percentCrop}
        keepSelection={true}
        aspect={aspect}
        onComplete={onCropComplete}
        onChange={(_, percentCrop) => setPercentCrop(percentCrop)}
        ruleOfThirds={true}
        minWidth={30}
        minHeight={30}
      >
        <img
          className='h-[345px] w-auto'
          ref={imgRef}
          alt='img'
          src={image}
          onLoad={onImageLoaded}
        />
      </ReactCrop>
    </div>
  )
}
