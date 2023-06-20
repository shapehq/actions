import os from "os"
import fs from "fs"
import path from "path"
import {FileSystem} from "./FileSystem"

export class FileSystemLive implements FileSystem {
  get homeDir(): string {
    return os.homedir()
  }
  
  listContentsOfDir(dirPath: string): string[] {
    if (fs.existsSync(dirPath)) {
      return fs.readdirSync(dirPath).map(f => path.join(dirPath, f))
    } else {
      return []
    }
  }
}
