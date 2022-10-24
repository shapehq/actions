import { v4 as uuid } from "uuid"

export function generateFilename(filename?: string | null): string {
  const baseFilename = filename || uuid()
  const suffix = ".mobileprovision"
  if (!baseFilename.endsWith(suffix)) {
    return baseFilename + suffix
  } else {
    return baseFilename
  }
} 