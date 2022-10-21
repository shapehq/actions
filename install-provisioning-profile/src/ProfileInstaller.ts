import * as path from "path"
const { PROVISIONING_PROFILES_DIR } = require("./constants")

type FilenameGenerator = (baseFilename: string | null) => string
type Base64Decoder = (baseFilename: string) => string
type DirectoryMaker = (baseFilename: string) => void
type FileWriter = (filePath: string, contents: string) => void

export class ProfileInstaller {
  generateFilename: FilenameGenerator
  decodeBase64: Base64Decoder
  mkdir: DirectoryMaker
  writeFile: FileWriter
  
  constructor(generateFilename: FilenameGenerator, 
              decodeBase64: Base64Decoder, 
              mkdir: DirectoryMaker,
              writeFile: FileWriter) {
    this.generateFilename = generateFilename
    this.decodeBase64 = decodeBase64
    this.mkdir = mkdir
    this.writeFile = writeFile
  }
  
  install(base64: string, baseFilename: string | null): string {
    const filename = this.generateFilename(baseFilename)
    const filePath = path.join(PROVISIONING_PROFILES_DIR, filename)
    let contents = this.decodeBase64(base64)
    this.mkdir(PROVISIONING_PROFILES_DIR)
    this.writeFile(filePath, contents)
    return filePath
  }
}
