import { existsSync, unlinkSync } from "fs"

export function removeFile(filePath: string) {
  if (existsSync(filePath)) {
    unlinkSync(filePath)
  }
}
