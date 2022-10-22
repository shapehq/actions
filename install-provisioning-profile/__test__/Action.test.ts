import * as path from "path"
import { Action } from "../src/Action"
import { MockStateStore } from "./mock/MockStateStore"
import { MockProvisioningProfileInstaller } from "./mock/MockProvisioningProfileInstaller"
import { MockProvisioningProfileStore } from "./mock/MockProvisioningProfileStore"
import { MockActionOptions } from "./mock/MockActionOptions"

test("Does not perform installation when no profile is provided", () => {
  let didInstallFile = false
  const stateStore = new MockStateStore()
  const provisioningProfileInstaller = {
    install: (profileBase64: string, baseFilename: string | null): string => {
      didInstallFile = true
      return baseFilename || ""
    }
  }
  const provisioningProfileStore = new MockProvisioningProfileStore()
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  expect(stateStore.isPost).not.toBeTruthy()
  const options = new MockActionOptions("foo")
  options.profileBase64 = ""
  action.run(options)
  expect(didInstallFile).not.toBeTruthy()
})

test("Enters post-phase after running main-phase", () => {
  const stateStore = new MockStateStore()
  const provisioningProfileInstaller = new MockProvisioningProfileInstaller()
  const provisioningProfileStore = new MockProvisioningProfileStore()
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  expect(stateStore.isPost).not.toBeTruthy()
  action.run(new MockActionOptions("foo"))
  expect(stateStore.isPost).toBeTruthy()
})

test("Uses filename passed in options", () => {
  const stateStore = new MockStateStore()
  const provisioningProfileInstaller = new MockProvisioningProfileInstaller()
  const provisioningProfileStore = new MockProvisioningProfileStore()
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  const options = new MockActionOptions("foo", "foo.mobileprovision")
  action.run(options)
  expect(provisioningProfileInstaller.installedFilename).toBe(options.filename)
})

test("Uses profile base64 passed in options", () => {
  const stateStore = new MockStateStore()
  const provisioningProfileInstaller = new MockProvisioningProfileInstaller()
  const provisioningProfileStore = new MockProvisioningProfileStore()
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  const options = new MockActionOptions("foo", "foo.mobileprovision")
  action.run(options)
  expect(provisioningProfileInstaller.installedProfileBase64).toBe(options.profileBase64)
})

test("Stores provisioning profile path in state", () => {
  const stateStore = new MockStateStore()
  const provisioningProfileInstaller = new MockProvisioningProfileInstaller()
  const provisioningProfileStore = new MockProvisioningProfileStore()
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  const options = new MockActionOptions("foo", "foo.mobileprovision")
  action.run(options)
  expect(stateStore.provisioningProfilePath).toBe(options.filename)
})

test("Only installs profile in main-phase", () => {
  let didInstallFile = false
  let didRemoveFile = false
  const stateStore = new MockStateStore()
  const provisioningProfileInstaller = {
    install: (profileBase64: string, baseFilename: string | null): string => {
      didInstallFile = true
      return baseFilename || ""
    }
  }
  const provisioningProfileStore = {
    store: (filename: string, content: string): string => {
      return filename
    },
    remove: (filePath: string) => {
      didRemoveFile = true
    }
  }
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  const options = new MockActionOptions("foo", "foo.mobileprovision")
  action.run(options)
  expect(didInstallFile).toBeTruthy()
  expect(didRemoveFile).not.toBeTruthy()
})

test("Only removes profile in post-phase", () => {
  let didInstallFile = false
  let didRemoveFile = false
  const stateStore = new MockStateStore()
  stateStore.isPost = true
  stateStore.provisioningProfilePath = "foo.mobileprovision"
  const provisioningProfileInstaller = {
    install: (profileBase64: string, baseFilename: string | null): string => {
      didInstallFile = true
      return baseFilename || ""
    }
  }
  const provisioningProfileStore = {
    store: (filename: string, content: string): string => {
      return filename
    },
    remove: (filePath: string) => {
      didRemoveFile = true
    }
  }
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  const options = new MockActionOptions("foo", "foo.mobileprovision")
  action.run(options)
  expect(didInstallFile).not.toBeTruthy()
  expect(didRemoveFile).toBeTruthy()
})

test("The post-phase deletes the same file as was stored in the main-phase", () => {
  let removedFilePath: string | null = null
  const stateStore = new MockStateStore()
  stateStore.isPost = true
  stateStore.provisioningProfilePath = "foo.mobileprovision"
  const provisioningProfileInstaller = new MockProvisioningProfileInstaller()
  const provisioningProfileStore = {
    store: (filename: string, content: string): string => {
      return filename
    },
    remove: (filePath: string) => {
      removedFilePath = filePath
    }
  }
  const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
  const options = new MockActionOptions("foo")
  action.run(options)
  expect(removedFilePath).toBe(stateStore.provisioningProfilePath)
})
