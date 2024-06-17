import fs from "fs"
import path from "path"
import { loadImage } from "canvas"
import {
  recolorPixels,
  renderLayers,
  renderToBuffer,
  getPixelColor
} from "./utils/renderer"
import hexToRgb from "./utils/hex-to-rgb"

export default async (filePaths: string[], hexCurlColor?: string) => {
  return await Promise.all(filePaths.map(async filePath => {
    return await renderBetaBadge(filePath, hexCurlColor)
  }))
}

async function renderBetaBadge(filePath: string, hexCurlColor?: string) {
  const betaResourcesDir = path.join(__dirname, "../resources/beta")
  const backgroundFilePath = path.join(betaResourcesDir, "background.png")
  const curlFilePath = path.join(betaResourcesDir, "curl.png")
  const innerShadowFilePath = path.join(betaResourcesDir, "inner_shadow.png")
  const outerShadowFilePath = path.join(betaResourcesDir, "outer_shadow.png")
  const backgroundImage = await loadImage(backgroundFilePath)
  const curlImage = await loadImage(curlFilePath)
  const innerShadowImage = await loadImage(innerShadowFilePath)
  const outerShadowImage = await loadImage(outerShadowFilePath)
  const appIconImage = await loadImage(filePath)
  let curlColor: { r: number, g: number, b: number }
  if (hexCurlColor) {
    curlColor = hexToRgb(hexCurlColor)
  } else {
    curlColor = getPixelColor(appIconImage, { x: appIconImage.width - 1, y: 0 })
  }
  const recoloredCurlImage = await recolorPixels(curlImage, curlColor)
  const layers = [appIconImage, backgroundImage, innerShadowImage, recoloredCurlImage, outerShadowImage]
  const targetSize = { width: appIconImage.width, height: appIconImage.height }
  const resultingImage = await renderLayers(layers, targetSize)
  const data = renderToBuffer(resultingImage)
  fs.writeFileSync(filePath, data)
}
