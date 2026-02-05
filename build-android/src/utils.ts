import { extname, basename } from 'path'
import { promises as fs } from 'fs'
import { APK_APP_TYPE, AAB_APP_TYPE } from './types.js'

export function parseVariants(input: string): string[] {
  if (!input.trim()) {
    return []
  }

  // Split by comma and clean up each variant
  const variants = input
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)

  return variants
}

export function capitalizeVariant(variant: string): string {
  if (!variant) {
    return variant
  }

  return variant.charAt(0).toUpperCase() + variant.slice(1)
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export function generateTimestamp(): string {
  const now = new Date()
  return now.toISOString().replace(/[-:T]/g, '').split('.')[0]
}

export function getFileExtension(filePath: string): string {
  return extname(filePath)
}

export function getBaseName(filePath: string): string {
  return basename(filePath)
}

export function removeExtension(fileName: string): string {
  const ext = extname(fileName)
  return fileName.substring(0, fileName.length - ext.length)
}

export function generateAppPathPatterns(module: string, variants: string[], appType: string): string[] {
  const patterns: string[] = []

  // Generate specific patterns based on module and variants
  if (module && variants.length > 0) {
    const modulePrefix = module.startsWith(':') ? module.substring(1) : module

    for (const variant of variants) {
      if (variant.trim()) {
        if (appType === APK_APP_TYPE) {
          // Specific module and variant APK patterns
          patterns.push(`${modulePrefix}/build/outputs/apk/${variant}/*.apk`)
          patterns.push(`${modulePrefix}/build/outputs/apk/*${variant}*/*.apk`)
        } else if (appType === AAB_APP_TYPE) {
          // Specific module and variant AAB patterns
          patterns.push(`${modulePrefix}/build/outputs/bundle/${variant}Release/*.aab`)
          patterns.push(`${modulePrefix}/build/outputs/bundle/*${variant}*/*.aab`)
        }
      }
    }
  } else if (module) {
    // Module specified but no variants - search all variants in the module
    const modulePrefix = module.startsWith(':') ? module.substring(1) : module

    if (appType === APK_APP_TYPE) {
      patterns.push(`${modulePrefix}/build/outputs/apk/*/*.apk`)
    } else if (appType === AAB_APP_TYPE) {
      patterns.push(`${modulePrefix}/build/outputs/bundle/*/*.aab`)
    }
  } else if (variants.length > 0) {
    // Variants specified but no module - search all modules for these variants
    for (const variant of variants) {
      if (variant.trim()) {
        if (appType === APK_APP_TYPE) {
          patterns.push(`*/build/outputs/apk/${variant}/*.apk`)
          patterns.push(`*/build/outputs/apk/*${variant}*/*.apk`)
        } else if (appType === AAB_APP_TYPE) {
          patterns.push(`*/build/outputs/bundle/${variant}Release/*.aab`)
          patterns.push(`*/build/outputs/bundle/*${variant}*/*.aab`)
        }
      }
    }
  }

  // Always add broad fallback patterns to catch any missed cases
  if (appType === APK_APP_TYPE) {
    patterns.push('*/build/outputs/apk/*/*.apk')
    patterns.push('*/build/outputs/apk/*.apk')
  } else if (appType === AAB_APP_TYPE) {
    patterns.push('*/build/outputs/bundle/*/*.aab')
    patterns.push('*/build/outputs/bundle/*.aab')
  }

  // Remove duplicates while preserving order
  return [...new Set(patterns)]
}

export function generateManifestPathPatterns(module: string, variants: string[]): string[] {
  const patterns: string[] = []
  const modulePrefix = module && module.startsWith(':') ? module.substring(1) : module
  const hasModule = Boolean(modulePrefix)
  const hasVariants = variants.length > 0

  const addVariantPatterns = (prefix: string, variant: string): void => {
    const trimmed = variant.trim()
    if (!trimmed) {
      return
    }

    const variantCap = capitalizeVariant(trimmed)

    patterns.push(`${prefix}/build/intermediates/merged_manifests/${trimmed}/process${variantCap}Manifest/AndroidManifest.xml`)
    patterns.push(`${prefix}/build/intermediates/merged_manifest/${trimmed}/AndroidManifest.xml`)
    patterns.push(`${prefix}/build/intermediates/merged_manifest/${trimmed}/merged/AndroidManifest.xml`)
    patterns.push(`${prefix}/build/intermediates/merged_manifests/${trimmed}/AndroidManifest.xml`)
    patterns.push(`${prefix}/build/intermediates/merged_manifests/${trimmed}/merged/AndroidManifest.xml`)
    patterns.push(`${prefix}/build/intermediates/merged_manifest/*${trimmed}*/AndroidManifest.xml`)
    patterns.push(`${prefix}/build/intermediates/merged_manifests/*${trimmed}*/AndroidManifest.xml`)
  }

  if (hasModule && hasVariants) {
    for (const variant of variants) {
      addVariantPatterns(modulePrefix, variant)
    }
  } else if (hasModule) {
    patterns.push(`${modulePrefix}/build/intermediates/merged_manifests/*/process*Manifest/AndroidManifest.xml`)
    patterns.push(`${modulePrefix}/build/intermediates/merged_manifest/*/AndroidManifest.xml`)
    patterns.push(`${modulePrefix}/build/intermediates/merged_manifest/*/merged/AndroidManifest.xml`)
    patterns.push(`${modulePrefix}/build/intermediates/merged_manifests/*/AndroidManifest.xml`)
    patterns.push(`${modulePrefix}/build/intermediates/merged_manifests/*/merged/AndroidManifest.xml`)
  } else if (hasVariants) {
    for (const variant of variants) {
      addVariantPatterns('*', variant)
    }
  }

  patterns.push('*/build/intermediates/merged_manifests/*/process*Manifest/AndroidManifest.xml')
  patterns.push('*/build/intermediates/merged_manifest/*/AndroidManifest.xml')
  patterns.push('*/build/intermediates/merged_manifest/*/merged/AndroidManifest.xml')
  patterns.push('*/build/intermediates/merged_manifests/*/AndroidManifest.xml')
  patterns.push('*/build/intermediates/merged_manifests/*/merged/AndroidManifest.xml')

  return [...new Set(patterns)]
}
