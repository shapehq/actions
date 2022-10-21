import { PROVISIONING_PROFILES_DIR } from "../src/constants"
import { ProfileInstaller } from "../src/ProfileInstaller"
import { makeMockLogger } from "./mock/make-mock-logger"
import { Logger } from "../src/Logger"

const mock = {
  filenameGenerator: (baseFilename: string | null) => {
    return baseFilename || "default.mobileprovision"
  },
  base64Decoder: (data: string) => {
    return data
  },
  makeDir: (dir: string) => {},
  fileWriter: (filePath: string, content: string) => {}
}

test("Writes to provisioning profiles directory", () => {
  let writtenFilePath: string | null = null
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    (filePath: string, content: string) => {
      writtenFilePath = filePath
    },
    makeMockLogger()
  )
  const filename = "profile.mobileprovision"
  profileInstaller.install("somedata", filename)
  expect(writtenFilePath).toBe(PROVISIONING_PROFILES_DIR + "/" + filename)
})

test("Calls base64 decoded", () => {
  let didDecode = false
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    (data: string) => {
      didDecode = true
      return data
    },
    mock.makeDir,
    mock.fileWriter,
    makeMockLogger()
  )
  profileInstaller.install("somedata", "profile.mobileprovision")
  expect(didDecode).toBeTruthy()
})

test("Writes decoded content", () => {
  const expectedWrittenContent = "This was written."
  let writtenContent: string | null = null
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    (data: string) => {
      return expectedWrittenContent
    },
    mock.makeDir,
    (filePath: string, content: string) => {
      writtenContent = content
    },
    makeMockLogger()
  )
  profileInstaller.install("somecontent", "profile.mobileprovision")
  expect(writtenContent).toBe(expectedWrittenContent)
})

test("Creates provisioning profiles directory", () => {
  let writtenDir: string | null = null
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    (dir: string) => {
      writtenDir = dir
    },
    mock.fileWriter,
    makeMockLogger()
  )
  profileInstaller.install("somedata", "someprofile.mobileprovision")
  expect(writtenDir).toBe(PROVISIONING_PROFILES_DIR)
})

test("Returns file path of the installed provisioning profile", () => {
  let writtenFilePath: string | null = null
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    (filePath: string, content: string) => {
      writtenFilePath = filePath
    },
    makeMockLogger()
  )
  const filename = "profile.mobileprovision"
  const expectedFilePath = PROVISIONING_PROFILES_DIR + "/" + filename
  const resultingFilePath = profileInstaller.install("somedata", filename)
  expect(resultingFilePath).toBe(writtenFilePath)
  expect(resultingFilePath).toBe(expectedFilePath)
})

test("Logs a message that includes the file path", () => {
  let writtenFilePath: string | null = null
  let loggedMessage: string | null = null
  const profileInstaller = new ProfileInstaller(
    mock.filenameGenerator,
    mock.base64Decoder,
    mock.makeDir,
    (filePath: string, content: string) => {
      writtenFilePath = filePath
    },
    new Logger({
      info: (message: string) => {
        loggedMessage = message
      }
    })
  )
  profileInstaller.install("somedata", "profile.mobileprovision")
  expect(loggedMessage).toContain(writtenFilePath)
})