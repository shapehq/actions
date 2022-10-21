import { ActionOptions, Action } from "../src/Action"
import { ProfileInstaller } from "../src/ProfileInstaller"
import { ProfileUninstaller } from "../src/ProfileUninstaller"
import { makeMockStateStore } from "./mock/make-mock-state-store"
import { PROVISIONING_PROFILES_DIR } from "../src/constants"

test("Enters post-phase after running main-phase", () => {
  const profileInstaller =  makeMockProfileInstaller()
  const profileUninstaller = makeMockProfileUninstaller()
  const stateStore = makeMockStateStore()
  expect(stateStore.isPost).not.toBeTruthy()
  const action = new Action(stateStore, profileInstaller, profileUninstaller)
  action.run(makeMockActionOptions())
  stateStore.isPost = true
  expect(stateStore.isPost).toBeTruthy()
})

test("Uses filename passed in options", () => {
  let writtenFilePath: string | null = null
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    (filePath: string, content: string) => {
      writtenFilePath = filePath
    }
  )
  const profileUninstaller = makeMockProfileUninstaller()
  const stateStore = makeMockStateStore()
  const action = new Action(stateStore, profileInstaller, profileUninstaller)
  let options = makeMockActionOptions()
  options.filename = "profile.mobileprovision"
  action.run(options)
  const expectedFilePath = PROVISIONING_PROFILES_DIR + "/" + options.filename
  expect(writtenFilePath).toBe(expectedFilePath)
})

test("Uses profile base64 passed in options", () => {
  let writtenContent: string | null = null
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    (filePath: string, content: string) => {
      writtenContent = content
    }
  )
  const profileUninstaller = makeMockProfileUninstaller()
  const stateStore = makeMockStateStore()
  const action = new Action(stateStore, profileInstaller, profileUninstaller)
  let options = makeMockActionOptions()
  action.run(options)
  expect(writtenContent).toBe(options.profileBase64)
})

test("Stores provisioning profile path in state", () => {
  const profileInstaller = makeMockProfileInstaller()
  const profileUninstaller = makeMockProfileUninstaller()
  const stateStore = makeMockStateStore()
  const action = new Action(stateStore, profileInstaller, profileUninstaller)
  let options = makeMockActionOptions()
  options.filename = "profile.mobileprovision"
  action.run(options)
  const expectedFilePath = PROVISIONING_PROFILES_DIR + "/" + options.filename
  expect(stateStore.provisioningProfilePath).toBe(expectedFilePath)
})

test("Only installs profile in main-phase", () => {
  let didWriteFile = false
  let didRemoveFile = false
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    (filePath: string, content: string) => {
      didWriteFile = true
    }
  )
  const profileUninstaller = new ProfileUninstaller(
    (filePath: string) => {
      didRemoveFile = true
    }
  )
  const stateStore = makeMockStateStore()
  const action = new Action(stateStore, profileInstaller, profileUninstaller)
  action.run(makeMockActionOptions())
  expect(didWriteFile).toBeTruthy()
  expect(didRemoveFile).not.toBeTruthy()
})

test("Only uninstalls profile in post-phase", () => {
  let didWriteFile = false
  let didRemoveFile = false
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    (filePath: string, content: string) => {
      didWriteFile = true
    }
  )
  const profileUninstaller = new ProfileUninstaller(
    (filePath: string) => {
      didRemoveFile = true
    }
  )
  const stateStore = makeMockStateStore()
  stateStore.isPost = true
  stateStore.provisioningProfilePath = "foo.mobileprovision"
  const action = new Action(stateStore, profileInstaller, profileUninstaller)
  action.run(makeMockActionOptions())
  expect(didWriteFile).not.toBeTruthy()
  expect(didRemoveFile).toBeTruthy()
})

test("The post-phase deletes the same file as was stored in the main-phase", () => {
  let removedFilePath: string | null = null
  const profileInstaller = makeMockProfileInstaller()
  const profileUninstaller = new ProfileUninstaller(
    (filePath: string) => {
      removedFilePath = filePath
    }
  )
  const filePath = PROVISIONING_PROFILES_DIR + "/foo.mobileprovision"
  const stateStore = makeMockStateStore()
  stateStore.isPost = true
  stateStore.provisioningProfilePath = filePath
  const action = new Action(stateStore, profileInstaller, profileUninstaller)
  action.run(makeMockActionOptions())
  expect(removedFilePath).toBe(filePath)
})

const mock = {
  filenameGenerator: (baseFilename: string | null) => {
    return baseFilename || "default.mobileprovision"
  },
  base64Decoder: (data: string) => {
    return data
  },
  makeDir: (dir: string) => {},
  fileWriter: (filePath: string, content: string) => {},
  fileRemover: (filePath: string) => {}
}

function makeMockProfileInstaller(): ProfileInstaller {
  return new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    mock.fileWriter
  )
}

function makeMockProfileUninstaller(): ProfileUninstaller {
  return new ProfileUninstaller(mock.fileRemover)
}

function makeMockActionOptions(): ActionOptions {
  return {
    profileBase64: "Hello world!",
    filename: null
  }
}
