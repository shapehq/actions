import path from "path"
import fs from "fs"

interface Color {
  readonly r: number
  readonly g: number
  readonly b: number
}

/**
 * Samples the icon's fill color from the icon.json configuration file.
 * This is more accurate than pixel sampling as it reads the actual
 * fill color that Icon Composer applies to the icon layers.
 */
export async function sampleIconColor(iconPath: string): Promise<Color | null> {
  const iconJsonPath = path.join(iconPath, "icon.json")

  if (!fs.existsSync(iconJsonPath)) {
    return null
  }

  try {
    const iconConfigContent = fs.readFileSync(iconJsonPath, "utf-8")
    const iconConfig = JSON.parse(iconConfigContent)

    // Check if there's a fill color at the root level
    if (iconConfig.fill) {
      let colorString: string | null = null

      // Try to get the color from various fill formats
      if (iconConfig.fill.solid) {
        colorString = iconConfig.fill.solid
      } else if (iconConfig.fill["automatic-gradient"]) {
        colorString = iconConfig.fill["automatic-gradient"]
      }

      if (colorString) {
        return parseColorString(colorString)
      }
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Parses a color string from icon.json format to RGB
 * Supports formats like:
 * - "display-p3:0.36863,0.77255,0.43922,1.00000"
 * - "srgb:0.10980,0.26275,0.47059,1.00000"
 */
function parseColorString(colorString: string): Color | null {
  try {
    // Extract the color values (format: "colorspace:r,g,b,a")
    const parts = colorString.split(":")
    if (parts.length !== 2) {
      return null
    }

    const values = parts[1].split(",").map(v => parseFloat(v))
    if (values.length < 3) {
      return null
    }

    // Convert from 0-1 range to 0-255 range
    return {
      r: Math.round(values[0] * 255),
      g: Math.round(values[1] * 255),
      b: Math.round(values[2] * 255)
    }
  } catch (error) {
    return null
  }
}

/**
 * Converts an RGB color to a hex string
 */
export function colorToHex(color: Color): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}
