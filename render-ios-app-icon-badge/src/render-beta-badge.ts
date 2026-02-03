import path from "path"
import {
  recolorPixels,
  renderLayers,
  getPixelColor,
  getImageSize
} from "./utils/imagemagick"
import { hexToRgb } from "./utils/hex"
import makeTmpFile from "./utils/make-tmp-file"

export default async (options: { filePaths: string[], curlColor?: string }) => {
  return await Promise.all(options.filePaths.map(async filePath => {
    return await renderBetaBadge({ filePath, curlColor: options.curlColor })
  }))
}

async function renderBetaBadge(options: { filePath: string, curlColor?: string }) {
  const curlColor = await getCurlColor(options.filePath, options.curlColor)
  const betaResourcesDir = path.join(__dirname, "../resources/beta")
  const backgroundFilePath = path.join(betaResourcesDir, "background.png")
  const gridFilePath = path.join(betaResourcesDir, "grid.png")
  const curlFilePath = path.join(betaResourcesDir, "curl.png")
  const curlShadowFilePath = path.join(betaResourcesDir, "curl_shadow.png")
  const curlHiglightsFilePath = path.join(betaResourcesDir, "curl_highlights.png")
  const curlInnerGlowFilePath = path.join(betaResourcesDir, "curl_inner_glow.png")
  const curlShadowOnGridFilePath = path.join(betaResourcesDir, "curl_shadow_on_grid.png")
  const tmpRecoloredCurlImage = makeTmpFile()
  await recolorPixels(curlFilePath, tmpRecoloredCurlImage.filePath, curlColor)
  const layers = [
    options.filePath,
    backgroundFilePath,
    curlShadowFilePath,
    tmpRecoloredCurlImage.filePath,
    curlHiglightsFilePath,
    gridFilePath,
    curlInnerGlowFilePath,
    curlShadowOnGridFilePath
  ]
  const targetSize = await getImageSize(options.filePath)
  await renderLayers(layers, options.filePath, targetSize)
  tmpRecoloredCurlImage.cleanUp()
}

async function getCurlColor(filePath: string, tintColor?: string) {
  const imageSize = await getImageSize(filePath)
  if (tintColor && typeof tintColor === 'string' && tintColor.length > 0) {
    return hexToRgb(tintColor)
  } else {
    return await getPixelColor(filePath, { x: imageSize.width - 1, y: 0 })
  }
}
