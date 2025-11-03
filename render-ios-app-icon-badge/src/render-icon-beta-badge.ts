import path from "path"
import fs from "fs"

interface FillSpecialization {
  appearance?: string
  value: {
    solid?: string
  }
}

interface GlassSpecialization {
  appearance?: string
  value: boolean
}

interface IconLayer {
  "glass"?: boolean
  "glass-specializations"?: GlassSpecialization[]
  "hidden"?: boolean
  "image-name": string
  "name": string
  "fill"?: string
  "fill-specializations"?: FillSpecialization[]
}

interface ShadowSpecialization {
  appearance?: string
  value: {
    kind: string
    opacity: number
  }
}

interface TranslucencySpecialization {
  appearance?: string
  value: {
    enabled: boolean
    value: number
  }
}

interface BlurMaterialSpecialization {
  appearance?: string
  value: number
}

interface IconGroup {
  layers: IconLayer[]
  "blur-material-specializations"?: BlurMaterialSpecialization[]
  lighting?: string
  "shadow-specializations"?: ShadowSpecialization[]
  specular?: boolean
  "translucency-specializations"?: TranslucencySpecialization[]
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

  // Build curl layer with fill-specializations
  const curlLayer: IconLayer = {
    "glass": false,
    "hidden": false,
    "image-name": "curl.png",
    "name": "curl"
  }

  if (options.curlColor && typeof options.curlColor === 'string' && options.curlColor.length > 0) {
    const hex = options.curlColor.replace(/^#/, '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    // Create fill-specializations with light and dark mode
    curlLayer["fill-specializations"] = [
      {
        value: {
          solid: `display-p3:${r.toFixed(5)},${g.toFixed(5)},${b.toFixed(5)},1.00000`
        }
      },
      {
        appearance: "dark",
        value: {
          solid: `display-p3:${r.toFixed(5)},${g.toFixed(5)},${b.toFixed(5)},1.00000`
        }
      }
    ]
  } else {
    // Default fill-specializations matching example.icon
    curlLayer["fill-specializations"] = [
      {
        value: {
          solid: "display-p3:0.10980,0.26275,0.47059,1.00000"
        }
      },
      {
        appearance: "dark",
        value: {
          solid: "display-p3:0.07059,0.12157,0.21569,1.00000"
        }
      }
    ]
  }

  const badgeGroup: IconGroup = {
    "blur-material-specializations": [
      {
        value: 0.5
      },
      {
        appearance: "tinted",
        value: 0.5
      }
    ],
    layers: [
      {
        "glass": false,
        "hidden": false,
        "image-name": "grid.png",
        "name": "grid"
      },
      {
        "glass": false,
        "image-name": "curl_highlights.png",
        "name": "curl_highlights"
      },
      {
        "glass": false,
        "image-name": "curl_shadow_on_grid.png",
        "name": "curl_shadow_on_grid"
      },
      {
        "glass": false,
        "image-name": "curl_inner_glow.png",
        "name": "curl_inner_glow"
      },
      curlLayer,
      {
        "glass": false,
        "hidden": false,
        "image-name": "curl_shadow.png",
        "name": "curl_shadow"
      },
      {
        "glass-specializations": [
          {
            value: true
          },
          {
            appearance: "tinted",
            value: false
          }
        ],
        "image-name": "background.png",
        "name": "background"
      }
    ],
    lighting: "individual",
    "shadow-specializations": [
      {
        value: {
          kind: "none",
          opacity: 0.5
        }
      },
      {
        appearance: "tinted",
        value: {
          kind: "none",
          opacity: 0.5
        }
      }
    ],
    specular: false,
    "translucency-specializations": [
      {
        value: {
          enabled: true,
          value: 0.5
        }
      },
      {
        appearance: "tinted",
        value: {
          enabled: true,
          value: 0.5
        }
      }
    ]
  }

  iconConfig.groups.unshift(badgeGroup)

  fs.writeFileSync(iconJsonPath, JSON.stringify(iconConfig, null, 2), "utf-8")

  console.log(`Successfully added badge to ${options.iconPath}`)
}
