import * as path from "path"
import { PROVISIONING_PROFILES_DIR } from "./constants"
import { Logger } from "./Logger"

type FilenameGenerator = (baseFilename: string | null) => string
type Base64Decoder = (baseFilename: string) => string
type DirectoryMaker = (baseFilename: string) => void
type FileWriter = (filePath: string, contents: string) => void

export class ProfileInstaller {
  generateFilename: FilenameGenerator
  decodeBase64: Base64Decoder
  mkdir: DirectoryMaker
  writeFile: FileWriter
  logger: Logger
  
  constructor(generateFilename: FilenameGenerator, 
              decodeBase64: Base64Decoder, 
              mkdir: DirectoryMaker,
              writeFile: FileWriter,
              logger: Logger) {
    this.generateFilename = generateFilename
    this.decodeBase64 = decodeBase64
    this.mkdir = mkdir
    this.writeFile = writeFile
    this.logger = logger
  }
  
  install(base64: string, baseFilename: string | null): string {
    const filename = this.generateFilename(baseFilename)
    const filePath = path.join(PROVISIONING_PROFILES_DIR, filename)
    let contents = this.decodeBase64(base64)
    this.mkdir(PROVISIONING_PROFILES_DIR)
    this.writeFile(filePath, contents)
    this.logger.info("Installed " + filePath)
    return filePath
  }
}
