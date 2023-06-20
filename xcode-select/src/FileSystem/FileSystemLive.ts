import os from "os"
import fs from "fs"
import {FileSystem} from "./FileSystem"

export class FileSystemLive implements FileSystem {
  get homeDir(): string {
    return os.homedir()
  }
  
  listContentsOfDir(dirPath: string): string[] {
    if (fs.existsSync(dirPath)) {
      return fs.readdirSync(dirPath)
    } else {
      return []
    }
  }
}
