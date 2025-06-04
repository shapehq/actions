import os from "os"
import fs from "fs"
import path from "path"
import IFileSystem from "./IFileSystem"

export default class FileSystem implements IFileSystem {
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
  
  realPath(path: string): string {
    try {
      return fs.realpathSync(path)
    } catch {
      return path
    }
  }
}
