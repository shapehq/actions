import { mkdirSync } from "fs"

export function mkdir(dir: string) {
  mkdirSync(dir, { recursive: true })
}
