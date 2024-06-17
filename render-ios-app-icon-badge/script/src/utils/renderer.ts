import { createCanvas, loadImage, Image } from "canvas"

export async function recolorPixels(
  image: Image, 
  color: { r: number, g: number, b: number }
) {
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext("2d")
  ctx.drawImage(image, 0, 0, image.width, image.height)
  const imageData = ctx.getImageData(0, 0, image.width, image.height)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 0) { // If alpha channel is not 0 (not transparent)
      data[i] = color.r
      data[i + 1] = color.g
      data[i + 2] = color.b
    }
  }
  ctx.putImageData(imageData, 0, 0)
  const buffer = canvas.toBuffer("image/png")
  return await loadImage(buffer)
}

export async function renderLayers(
  images: Image[], 
  targetSize: { width: number, height: number }
) {
  const canvas = createCanvas(targetSize.width, targetSize.height)
  const ctx = canvas.getContext("2d")
  for (const image of images) {
    ctx.drawImage(image, 0, 0, targetSize.width, targetSize.height)
  }
  const buffer = canvas.toBuffer("image/png")
  return await loadImage(buffer)
}

export function getPixelColor(image: Image, point: { x: number, y: number }) {
  if (point.x < 0 || point.x > image.width) {
    throw new Error("point.x must be within the width of the image")
  }
  if (point.y < 0 || point.y > image.height) {
    throw new Error("point.y must be within the height of the image")
  }
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext("2d")
  ctx.drawImage(image, 0, 0, image.width, image.height)
  const pixel = ctx.getImageData(point.x, point.y, 1, 1)
  const pixelData = pixel.data
  return { r: pixelData[0], g: pixelData[1], b: pixelData[2] }
}

export function renderToBuffer(image: Image) {
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext("2d")
  ctx.drawImage(image, 0, 0, image.width, image.height)
  return canvas.toBuffer("image/png")
}