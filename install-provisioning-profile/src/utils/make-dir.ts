import { existsSync, mkdirSync } from "fs"

export function makeDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}
