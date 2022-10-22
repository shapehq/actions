import { ProvisioningProfileStore } from "./ProvisioningProfileStore"

type FilenameGenerator = (baseFilename: string | null) => string
type Base64Decoder = (baseFilename: string) => string

export class LiveProvisioningProfileInstaller {
  generateFilename: FilenameGenerator
  base64Decoder: Base64Decoder
  store: ProvisioningProfileStore

  constructor(generateFilename: FilenameGenerator, 
              base64Decoder: Base64Decoder, 
              store: ProvisioningProfileStore) {
    this.generateFilename = generateFilename
    this.base64Decoder = base64Decoder
    this.store = store
  }

  install(baseFilename: string | null, profileBase64: string): string {
    const filename = this.generateFilename(baseFilename)
    const content = this.base64Decoder(profileBase64)
    return this.store.store(filename, content)
  }
}
