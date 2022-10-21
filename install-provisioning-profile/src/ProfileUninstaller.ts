import * as path from "path"
import { Logger } from "./Logger"
import { PROVISIONING_PROFILES_DIR } from "./constants"

type FileRemover = (filePath: string) => void

export class ProfileUninstaller {
  fileRemover: FileRemover
  logger: Logger
  
  constructor(fileRemover: FileRemover, logger: Logger) {
    this.fileRemover = fileRemover
    this.logger = logger
  }
  
  uninstall(filePath: string) {
    this.fileRemover(filePath)
    this.logger.info("Uninstalled " + filePath)
  }
}
