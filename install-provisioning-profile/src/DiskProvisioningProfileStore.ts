import * as os from "os"
import * as path from "path"
import { Logger } from "./Logger"
import { ProvisioningProfileStore } from "./ProvisioningProfileStore"

type FileExistanceChecker = (filePath: string) => boolean
type DirectoryCreator = (dir: string) => void
type FileWriter = (filePath: string, content: Buffer) => void
type FileRemover = (filePath: string) => void

export interface DiskProvisioningProfileStoreArguments {
  logger: Logger
  dir: string
  fileExistanceChecker: FileExistanceChecker
  directoryCreator: DirectoryCreator
  fileWriter: FileWriter
  fileRemover: FileRemover
}

export class DiskProvisioningProfileStore implements ProvisioningProfileStore {
  logger: Logger
  dir: string
  fileExistanceChecker: FileExistanceChecker
  directoryCreator: DirectoryCreator
  fileWriter: FileWriter
  fileRemover: FileRemover
  
  constructor(args: DiskProvisioningProfileStoreArguments) {
    this.logger = args.logger
    this.dir = args.dir
    this.fileExistanceChecker = args.fileExistanceChecker
    this.directoryCreator = args.directoryCreator
    this.fileWriter = args.fileWriter
    this.fileRemover = args.fileRemover
  }

  store(filename: string, content: Buffer): string {
    if (!this.fileExistanceChecker(this.dir)) {
      this.directoryCreator(this.dir)
    }
    const filePath = path.join(this.dir, filename)
    this.fileWriter(filePath, content)
    this.logger.info("Created " + filePath)
    return filePath
  }

  remove(filename: string) {
    const filePath = path.join(this.dir, filename)
    if (this.fileExistanceChecker(filePath)) {
      this.fileRemover(filePath)
      this.logger.info("Removed " + filePath)
    }
  }
}