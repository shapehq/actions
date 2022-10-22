import * as path from "path"
import { LiveProvisioningProfileInstaller } from "../src/LiveProvisioningProfileInstaller"
import { MockProvisioningProfileStore } from "./mock/MockProvisioningProfileStore"

const mock = {
  filenameGenerator: (baseFilename: string | null) => {
    return baseFilename || "default.mobileprovision"
  }
}

test("Returns file path of the installed provisioning profile", () => {
  const store = new MockProvisioningProfileStore()
  const installer = new LiveProvisioningProfileInstaller(mock.filenameGenerator, store)
  const filename = "profile.mobileprovision"
  const filePath = installer.install(filename, "somedata")
  const expectedFilePath = path.join(store.dir, filename)
  expect(filePath).toBe(expectedFilePath)
})

test("Writes to provisioning profiles store", () => {
  const store = new MockProvisioningProfileStore()
  const installer = new LiveProvisioningProfileInstaller(mock.filenameGenerator, store)
  expect(Object.keys(store.storedFiles).length).toBe(0)
  const filePath = installer.install("profile.mobileprovision", "somedata")
  expect(Object.keys(store.storedFiles)).toContain(filePath)
})
