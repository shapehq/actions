import path from "path"
import fs from "fs"

interface IconLayer {
  "glass"?: boolean
  "hidden"?: boolean
  "image-name": string
  "name": string
  "fill"?: string
}

interface IconGroup {
  layers: IconLayer[]
  shadow?: {
    kind: string
    opacity: number
  }
  translucency?: {
    enabled: boolean
    value: number
  }
}

interface IconConfig {
  fill?: any
  groups: IconGroup[]
  "supported-platforms"?: any
}

export default async (options: { iconPaths: string[], curlColor?: string }) => {
  return await Promise.all(options.iconPaths.map(async iconPath => {
    return await renderBetaBadgeToIcon({ iconPath, curlColor: options.curlColor })
  }))
}

async function renderBetaBadgeToIcon(options: { iconPath: string, curlColor?: string }) {
  const iconJsonPath = path.join(options.iconPath, "icon.json")
  const assetsDir = path.join(options.iconPath, "Assets")

  const iconConfigContent = fs.readFileSync(iconJsonPath, "utf-8")
  const iconConfig: IconConfig = JSON.parse(iconConfigContent)

  const betaResourcesDir = path.join(__dirname, "../resources/beta")
  const badgeAssets = [
    "grid.png",
    "curl.png",
    "curl_shadow.png",
    "curl_shadow_on_grid.png",
    "curl_inner_glow.png",
    "curl_highlights.png",
    "background.png"
  ]

  for (const asset of badgeAssets) {
    const sourcePath = path.join(betaResourcesDir, asset)
    const destPath = path.join(assetsDir, asset)

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath)
    }
  }

  const curlLayer: IconLayer = {
    "glass": true,
    "hidden": false,
    "image-name": "curl.png",
    "name": "curl"
  }

  if (options.curlColor) {
    const hex = options.curlColor.replace(/^#/, '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    curlLayer.fill = {
      "solid": `srgb:${r.toFixed(5)},${g.toFixed(5)},${b.toFixed(5)},1.00000`
    } as any
  }

  const badgeGroup: IconGroup = {
    layers: [
      {
        "glass": false,
        "hidden": false,
        "image-name": "grid.png",
        "name": "grid"
      },
      curlLayer,
      {
        "glass": true,
        "hidden": false,
        "image-name": "curl_shadow.png",
        "name": "curl_shadow"
      },
      {
        "glass": true,
        "hidden": false,
        "image-name": "curl_shadow_on_grid.png",
        "name": "curl_shadow_on_grid"
      },
      {
        "glass": true,
        "hidden": false,
        "image-name": "curl_inner_glow.png",
        "name": "curl_inner_glow"
      },
      {
        "glass": true,
        "hidden": false,
        "image-name": "curl_highlights.png",
        "name": "curl_highlights"
      },
      {
        "fill": "none",
        "glass": true,
        "image-name": "background.png",
        "name": "background"
      }
    ],
    shadow: {
      kind: "neutral",
      opacity: 0.5
    },
    translucency: {
      enabled: true,
      value: 0.5
    }
  }

  iconConfig.groups.unshift(badgeGroup)

  fs.writeFileSync(iconJsonPath, JSON.stringify(iconConfig, null, 2), "utf-8")

  console.log(`Successfully added badge to ${options.iconPath}`)
}
