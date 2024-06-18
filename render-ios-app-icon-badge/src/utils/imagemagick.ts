import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

interface Color {
  readonly r: number
  readonly g: number
  readonly b: number
}

interface Point {
  readonly x: number
  readonly y: number
}

interface Size {
  readonly width: number
  readonly height: number
}

export async function recolorPixels(
  imagePath: string,
  outputPath: string, 
  color: Color
): Promise<void> {
  await runCommand(`
    magick "${imagePath}" \
    -alpha set \
    -fill "rgb(${color.r},${color.g},${color.b})" \
    -colorize 100% \
    "${outputPath}"
  `)
}

export async function renderLayers(
  imagePaths: string[], 
  outputPath: string, 
  targetSize: Size
) {
  let command = "magick"
  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i]
    command += ` \\( "${imagePath}" -resize ${targetSize.width}x${targetSize.height} \\)`
    if (i > 0) {
      command += " -composite "
    }
  }
  command += ` "${outputPath}" `
  await runCommand(command)
}

export async function getPixelColor(imagePath: string, point: Point): Promise<Color> {
  const imageSize = await getImageSize(imagePath)
  if (point.x < 0 || point.x >= imageSize.width || point.y < 0 || point.y >= imageSize.height) {
    throw new Error("Point must be within the dimensions of the image")
  }
  const command = `
    magick "${imagePath}[1x1+${point.x}+${point.y}]" \
    -format "%[fx:int(255*r)],%[fx:int(255*g)],%[fx:int(255*b)]" info:
  `
  const stdout = await runCommand(command)
  const comps = stdout.split(",")
  if (comps.length == 3) {
    return { r: parseInt(comps[0]), g: parseInt(comps[1]), b: parseInt(comps[2]) }
  } else {
    throw new Error("Could not retrieve pixel color")
  }
}

export async function getImageSize(imagePath: string): Promise<Size> {
  const command = `identify -format "%wx%h" "${imagePath}"`
  const { stdout } = await execAsync(command.trim())
  const [width, height] = stdout.split("x").map(dim => parseInt(dim))
  return { width, height }
}

async function runCommand(command: string) {
  const { stdout, stderr } = await execAsync(command.trim())
  if (stderr) {
    throw new Error(stderr)
  }
  return stdout
}
