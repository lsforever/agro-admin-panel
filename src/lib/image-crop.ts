export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url as string
  })

import { type Crop } from 'react-image-crop'
/**
 * This method returns image crop with size less than or needed size
 * crop should be aspect ratio locked. and needed size should be in that same aspect ratio
 * The crop with size of needed or less than that will be sent. Less than that will only be sent if the crop size is lower than the needed size.
 */
export default async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Crop,
  quality = 0.8,
  neededWidth = 400,
  neededHeight = 300,
  isNeededAsBase64 = false,
): Promise<string | undefined> {
  const image: HTMLImageElement = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return undefined
  }
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')
  if (!croppedCtx) {
    return undefined
  }

  const isLarge = pixelCrop.width > neededWidth
  croppedCanvas.width = isLarge ? neededWidth : pixelCrop.width
  croppedCanvas.height = isLarge ? neededHeight : pixelCrop.height

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    isLarge ? neededWidth : pixelCrop.width,
    isLarge ? neededHeight : pixelCrop.height,
  )
  // ============================================== 02

  // As Base64 string
  if (isNeededAsBase64) {
    return croppedCanvas.toDataURL('image/jpeg')
  }

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        blob
          ? resolve(URL.createObjectURL(blob))
          : reject(new Error('the image canvas is empty'))
      },
      'image/jpeg',
      quality,
    )
  })
}
