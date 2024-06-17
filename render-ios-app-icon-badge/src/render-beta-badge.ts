import tmp from "tmp"
import path from "path"
import {
  recolorPixels,
  renderLayers,
  getPixelColor,
  getImageSize
} from "./utils/imagemagick"
import hexToRgb from "./utils/hex-to-rgb"

export default async (filePaths: string[], hexCurlColor?: string) => {
  return await Promise.all(filePaths.map(async filePath => {
    return await renderBetaBadge(filePath, hexCurlColor)
  }))
}

async function renderBetaBadge(filePath: string, hexCurlColor?: string) {
  const imageSize = await getImageSize(filePath)
  const betaResourcesDir = path.join(__dirname, "../resources/beta")
  const backgroundFilePath = path.join(betaResourcesDir, "background.png")
  const curlFilePath = path.join(betaResourcesDir, "curl.png")
  const innerShadowFilePath = path.join(betaResourcesDir, "inner_shadow.png")
  const outerShadowFilePath = path.join(betaResourcesDir, "outer_shadow.png")
  let curlColor: { r: number, g: number, b: number }
  if (hexCurlColor && hexCurlColor.length > 0) {
    curlColor = hexToRgb(hexCurlColor)
  } else {
    curlColor = await getPixelColor(filePath, { x: imageSize.width - 1, y: 0 })
  }
  const tmpRecoloredCurlImage: {
    name: string,
    removeCallback: () => void
  } = tmp.fileSync()
  await recolorPixels(curlFilePath, tmpRecoloredCurlImage.name, curlColor)
  const layers = [
    filePath,
    backgroundFilePath,
    tmpRecoloredCurlImage.name,
    outerShadowFilePath,
    innerShadowFilePath
  ]
  const targetSize = await getImageSize(filePath)
  await renderLayers(layers, filePath, targetSize)
  tmpRecoloredCurlImage.removeCallback()
}
