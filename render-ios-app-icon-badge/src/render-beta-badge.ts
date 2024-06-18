import path from "path"
import {
  recolorPixels,
  renderLayers,
  getPixelColor,
  getImageSize
} from "./utils/imagemagick"
import { hexToRgb } from "./utils/hex"
import makeTmpFile from "./utils/make-tmp-file"

export default async (options: {
  filePaths: string[],
  primaryBackgroundColor: string,
  secondaryBackgroundColor: string,
  curlColor?: string
}) => {
  return await Promise.all(options.filePaths.map(async filePath => {
    return await renderBetaBadge({
      filePath,
      primaryBackgroundColor: options.primaryBackgroundColor,
      secondaryBackgroundColor: options.secondaryBackgroundColor,
      curlColor: options.curlColor
    })
  }))
}

async function renderBetaBadge(options: {
  filePath: string,
  primaryBackgroundColor: string,
  secondaryBackgroundColor: string,
  curlColor?: string
}) {
  const primaryBackgroundColor = hexToRgb(options.primaryBackgroundColor)
  const secondaryBackgroundColor = hexToRgb(options.secondaryBackgroundColor)
  const curlColor = await getCurlColor(options.filePath, options.curlColor)
  const betaResourcesDir = path.join(__dirname, "../resources/beta")
  const backgroundFilePath = path.join(betaResourcesDir, "background.png")
  const gridFilePath = path.join(betaResourcesDir, "grid.png")
  const curlFilePath = path.join(betaResourcesDir, "curl.png")
  const innerShadowFilePath = path.join(betaResourcesDir, "inner_shadow.png")
  const outerShadowFilePath = path.join(betaResourcesDir, "outer_shadow.png")
  const tmpRecoloredBackgroundImage = makeTmpFile()
  const tmpRecoloredGridImage = makeTmpFile()
  const tmpRecoloredCurlImage = makeTmpFile()
  await recolorPixels(backgroundFilePath, tmpRecoloredBackgroundImage.filePath, primaryBackgroundColor)
  await recolorPixels(gridFilePath, tmpRecoloredGridImage.filePath, secondaryBackgroundColor)
  await recolorPixels(curlFilePath, tmpRecoloredCurlImage.filePath, curlColor)
  const layers = [
    options.filePath,
    tmpRecoloredBackgroundImage.filePath,
    tmpRecoloredGridImage.filePath,
    tmpRecoloredCurlImage.filePath,
    outerShadowFilePath,
    innerShadowFilePath
  ]
  const targetSize = await getImageSize(options.filePath)
  await renderLayers(layers, options.filePath, targetSize)
  tmpRecoloredBackgroundImage.cleanUp()
  tmpRecoloredGridImage.cleanUp()
  tmpRecoloredCurlImage.cleanUp()
}

async function getCurlColor(filePath: string, tintColor?: string) {
  const imageSize = await getImageSize(filePath)
  if (tintColor && tintColor.length > 0) {
    return hexToRgb(tintColor)
  } else {
    return await getPixelColor(filePath, { x: imageSize.width - 1, y: 0 })
  }
}