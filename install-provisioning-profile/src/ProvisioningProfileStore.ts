export interface ProvisioningProfileStore {
  store(filename: string, content: Buffer): string
  remove(filename: string)
}
