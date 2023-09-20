// /**
//  * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
//  */
// export default async function getCroppedImg(
//   imageSrc,
//   pixelCrop,
//   rotation = 0,
//   flip = { horizontal: false, vertical: false },
// ) {
//   const image = await createImage(imageSrc)
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')

//   if (!ctx) {
//     return null
//   }

//   const rotRad = getRadianAngle(rotation)

//   // calculate bounding box of the rotated image
//   const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
//     image.width,
//     image.height,
//     rotation,
//   )

//   // set canvas size to match the bounding box
//   canvas.width = bBoxWidth
//   canvas.height = bBoxHeight

//   // translate canvas context to a central location to allow rotating and flipping around the center
//   ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
//   ctx.rotate(rotRad)
//   ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
//   ctx.translate(-image.width / 2, -image.height / 2)

//   // draw rotated image
//   ctx.drawImage(image, 0, 0)

//   const croppedCanvas = document.createElement('canvas')

//   const croppedCtx = croppedCanvas.getContext('2d')

//   if (!croppedCtx) {
//     return null
//   }

//   // Set the size of the cropped canvas
//   croppedCanvas.width = pixelCrop.width
//   croppedCanvas.height = pixelCrop.height

//   // Draw the cropped image onto the new canvas
//   croppedCtx.drawImage(
//     canvas,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height,
//   )

//   // As Base64 string
//   // return croppedCanvas.toDataURL('image/jpeg');

//   // As a blob
//   return new Promise((resolve, reject) => {
//     croppedCanvas.toBlob(
//       (file) => {
//         resolve(URL.createObjectURL(file))
//       },
//       'image/jpeg',
//       0.6,
//     )
//   })
// }

// /**
//  * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
//  */
// export default async function getCroppedImg(
//   imageSrc,
//   pixelCrop,
//   rotation = 0,
//   flip = { horizontal: false, vertical: false },
// ) {
//   const image = await createImage(imageSrc)
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')

//   if (!ctx) {
//     return null
//   }

//   const rotRad = getRadianAngle(rotation)

//   // calculate bounding box of the rotated image
//   const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
//     image.width,
//     image.height,
//     rotation,
//   )

//   // set canvas size to match the bounding box
//   canvas.width = bBoxWidth
//   canvas.height = bBoxHeight

//   // translate canvas context to a central location to allow rotating and flipping around the center
//   ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
//   ctx.rotate(rotRad)
//   ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
//   ctx.translate(-image.width / 2, -image.height / 2)

//   // draw rotated image
//   ctx.drawImage(image, 0, 0)

//   const croppedCanvas = document.createElement('canvas')

//   const croppedCtx = croppedCanvas.getContext('2d')

//   if (!croppedCtx) {
//     return null
//   }

//   // Set the size of the cropped canvas
//   // croppedCanvas.width = pixelCrop.width
//   // croppedCanvas.height = pixelCrop.height
//   croppedCanvas.width = pixelCrop.width
//   croppedCanvas.height = pixelCrop.height
//   if (pixelCrop.width > 400) {
//     croppedCanvas.width = 400
//     croppedCanvas.height = 300
//   }

//   // Draw the cropped image onto the new canvas
//   // croppedCtx.drawImage(
//   //   canvas,
//   //   pixelCrop.x,
//   //   pixelCrop.y,
//   //   pixelCrop.width,
//   //   pixelCrop.height,
//   //   0,
//   //   0,
//   //   pixelCrop.width,
//   //   pixelCrop.height,
//   // )
//   croppedCtx.drawImage(
//     canvas,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     400,
//     300,
//   )

//   // As Base64 string
//   // return croppedCanvas.toDataURL('image/jpeg');

//   // As a blob
//   return new Promise((resolve, reject) => {
//     croppedCanvas.toBlob(
//       (file) => {
//         resolve(URL.createObjectURL(file))
//       },
//       'image/jpeg',
//       0.6,
//     )
//   })
// }

// TODO after this -

// export default async function getCroppedImg(
//   image,
//   crop,
//   fileName = 'image.jpeg',
// ) {
//   image = await createImage(image) //TODO remove this if img file is provided
//   const imageCanvas = document.createElement('canvas')
//   const scaleX = image.naturalWidth / image.width
//   const scaleY = image.naturalHeight / image.height
//   imageCanvas.width = crop.width
//   imageCanvas.height = crop.height
//   const imgCx = imageCanvas.getContext('2d')

//   if (!imgCx) {
//     return null
//   }

//   imgCx.drawImage(
//     image,
//     crop.x * scaleX,
//     crop.y * scaleY,
//     crop.width * scaleX,
//     crop.height * scaleY,
//     0,
//     0,
//     crop.width,
//     crop.height,
//   )
//   return new Promise((reject, resolve) => {
//     imageCanvas.toBlob((blob) => {
//       resolve(URL.createObjectURL(blob))
//       // if (!blob) {
//       //   reject(new Error('the image canvas is empty'))
//       //   return
//       // } else {
//       //   resolve(URL.createObjectURL(blob))
//       // }
//     }, 'image/jpeg')
//   })
// }

////////////////////////////// ==================
// ================================================================

// export default async function getCroppedImg(
//   imageSrc: string,
//   pixelCrop: cropType,
//   quality = 0.8,
// ) {
//   const neededWidth = 400
//   const neededHeight = 300
//   const image: HTMLImageElement = await createImage(imageSrc)
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')
//   if (!ctx) {
//     return null
//   }
//   canvas.width = image.width
//   canvas.height = image.height
//   ctx.drawImage(image, 0, 0)

//   const croppedCanvas = document.createElement('canvas')
//   const croppedCtx = croppedCanvas.getContext('2d')
//   if (!croppedCtx) {
//     return null
//   }
//   // ============================================== 01
//   // Set the size of the cropped canvas
//   // croppedCanvas.width = pixelCrop.width
//   // croppedCanvas.height = pixelCrop.height
//   croppedCanvas.width = pixelCrop.width
//   croppedCanvas.height = pixelCrop.height
//   if (pixelCrop.width > neededWidth) {
//     croppedCanvas.width = neededWidth
//     croppedCanvas.height = neededHeight
//   }
//   // ============================================== 01

//   // ============================================== 02
//   // Draw the cropped image onto the new canvas
//   // croppedCtx.drawImage(
//   //   canvas,
//   //   pixelCrop.x,
//   //   pixelCrop.y,
//   //   pixelCrop.width,
//   //   pixelCrop.height,
//   //   0,
//   //   0,
//   //   pixelCrop.width,
//   //   pixelCrop.height,
//   // )
//   croppedCtx.drawImage(
//     canvas,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     neededWidth,
//     neededHeight,
//   )
//   // ============================================== 02

//   // As Base64 string //TODO
//   // return croppedCanvas.toDataURL('image/jpeg');

//   // As a blob
//   return new Promise((resolve, reject) => {
//     croppedCanvas.toBlob(
//       (blob) => {
//         blob
//           ? resolve(URL.createObjectURL(blob))
//           : reject(new Error('the image canvas is empty'))
//       },
//       'image/jpeg',
//       quality,
//     )
//   })
// }
