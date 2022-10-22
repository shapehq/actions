export interface ProvisioningProfileStore {
  store(filename: string, content: string): string
  remove(filename: string)
}
