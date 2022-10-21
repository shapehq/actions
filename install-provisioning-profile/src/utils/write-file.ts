import { writeFileSync } from "fs"

export function writeFile(filePath: string, content: string) {
  writeFileSync(filePath, content)
}
