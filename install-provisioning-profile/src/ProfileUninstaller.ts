import * as path from "path"
const { PROVISIONING_PROFILES_DIR } = require("./constants")

type FileRemover = (filePath: string) => void

export class ProfileUninstaller {
  fileRemover: FileRemover
  
  constructor(fileRemover: FileRemover) {
    this.fileRemover = fileRemover
  }
  
  uninstall(filePath: string) {
    this.fileRemover(filePath)
  }
}
