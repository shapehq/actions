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
