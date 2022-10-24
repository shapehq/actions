export interface ProvisioningProfileInstaller {
  install(baseFilename: string | null, profileBase64: string): string
}
