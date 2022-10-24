import { ProvisioningProfileStore } from "./ProvisioningProfileStore"

type FilenameGenerator = (baseFilename: string | null) => string

export class LiveProvisioningProfileInstaller {
  generateFilename: FilenameGenerator
  store: ProvisioningProfileStore

  constructor(generateFilename: FilenameGenerator, store: ProvisioningProfileStore) {
    this.generateFilename = generateFilename
    this.store = store
  }

  install(baseFilename: string | null, profileBase64: string): string {
    const filename = this.generateFilename(baseFilename)
    const buffer = Buffer.from(profileBase64, "base64")
    return this.store.store(filename, buffer)
  }
}
