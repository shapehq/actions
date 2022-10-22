import * as path from "path"
import { LiveProvisioningProfileInstaller } from "../src/LiveProvisioningProfileInstaller"
import { MockProvisioningProfileStore } from "./mock/MockProvisioningProfileStore"

const mock = {
  filenameGenerator: (baseFilename: string | null) => {
    return baseFilename || "default.mobileprovision"
  },
  base64Decoder: (data: string) => {
    return data
  }
}

test("Returns file path of the installed provisioning profile", () => {
  const store = new MockProvisioningProfileStore()
  const installer = new LiveProvisioningProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    store
  )
  const filename = "profile.mobileprovision"
  const filePath = installer.install(filename, "somedata")
  const expectedFilePath = path.join(store.dir, filename)
  expect(filePath).toBe(expectedFilePath)
})

test("Writes to provisioning profiles store", () => {
  const store = new MockProvisioningProfileStore()
  const installer = new LiveProvisioningProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    store
  )
  expect(Object.keys(store.storedFiles).length).toBe(0)
  const filePath = installer.install("profile.mobileprovision", "somedata")
  expect(Object.keys(store.storedFiles)).toContain(filePath)
})

test("Calls base64 decoder", () => {
  let didDecode = false
  const store = new MockProvisioningProfileStore()
  const installer = new LiveProvisioningProfileInstaller(
    mock.filenameGenerator,
    (data: string) => {
      didDecode = true
      return data
    },
    store
  )
  installer.install("profile.mobileprovision", "somedata")
  expect(didDecode).toBeTruthy()
})

test("Writes decoded content", () => {
  const expectedWrittenContent = "This was written."
  const store = new MockProvisioningProfileStore()
  const installer = new LiveProvisioningProfileInstaller(
    mock.filenameGenerator,
    (data: string) => {
      return expectedWrittenContent
    },
    store
  )
  const filename = "profile.mobileprovision"
  const filePath = installer.install(filename, "somedata")
  expect(store.storedFiles[filePath]).toBe(expectedWrittenContent)
})