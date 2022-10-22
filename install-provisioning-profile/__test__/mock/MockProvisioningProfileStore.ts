import * as path from "path"
import { ProvisioningProfileStore } from "../../src/ProvisioningProfileStore"

export class MockProvisioningProfileStore implements ProvisioningProfileStore {
  public storedFiles = {}
  dir: string
  
  constructor(dir: string = "/Users/timapple/Library/MobileDevice/Provisioning Profiles") {
    this.dir = dir
  }
  
  store(filename: string, content: Buffer): string {
    const filePath = path.join(this.dir, filename)
    this.storedFiles[filePath] = content
    return filePath
  }

  remove(filename: string) {
    const filePath = path.join(this.dir, filename)
    delete this.storedFiles[filePath]
  }
}
