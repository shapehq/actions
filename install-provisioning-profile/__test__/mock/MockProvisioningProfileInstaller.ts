import { ProvisioningProfileInstaller } from "../../src/ProvisioningProfileInstaller"

export class MockProvisioningProfileInstaller implements ProvisioningProfileInstaller {
  installedProfileBase64: string | null = null
  installedFilename: string | null = null
  
  install(baseFilename: string | null, profileBase64: string): string {
    this.installedFilename = baseFilename
    this.installedProfileBase64 = profileBase64
    return baseFilename || ""
  }
}