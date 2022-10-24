import * as path from "path"
import { DiskProvisioningProfileStore } from "../src/DiskProvisioningProfileStore"
import { MockDiskProvisioningProfileStoreArguments } from "./mock/MockDiskProvisioningProfileStoreArguments"
import { MockLogger } from "./mock/MockLogger"

test("Logs a message that includes file path when creating file", () => {
  let loggedMessage: string | null = null
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.logger = {
    info: (message: string) => {
      loggedMessage = message
    }
  }
  const store = new DiskProvisioningProfileStore(args)
  const filename = "foo.mobileprovision"
  const expectedFilePath = path.join(args.dir, filename)
  store.store(filename, Buffer.from("foo", "utf-8"))
  expect(loggedMessage).toContain(expectedFilePath)
})

test("Logs a message that includes file path when removing file", () => {
  let loggedMessage: string | null = null
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.logger = {
    info: (message: string) => {
      loggedMessage = message
    }
  }
  args.fileExistanceChecker = (filePath: string) => {
    return true
  }
  const store = new DiskProvisioningProfileStore(args)
  const filename = "foo.mobileprovision"
  const expectedFilePath = path.join(args.dir, filename)
  store.remove(filename)
  expect(loggedMessage).toContain(expectedFilePath)
})

test("Does not log message when removing file if file does not exist", () => {
  let loggedMessage: string | null = null
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.logger = {
    info: (message: string) => {
      loggedMessage = message
    }
  }
  args.fileExistanceChecker = (filePath: string) => {
    return false
  }
  const store = new DiskProvisioningProfileStore(args)
  const filename = "foo.mobileprovision"
  const expectedFilePath = path.join(args.dir, filename)
  store.remove(filename)
  expect(loggedMessage).toBeNull()
})

test("Creates directory if it does not exist", () => {
  let didCreateDirectory = false
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.fileExistanceChecker = (filePath: string) => {
    return false
  }
  args.directoryCreator = (dir: string) => {
    didCreateDirectory = true
  }
  const store = new DiskProvisioningProfileStore(args)
  store.store("foo.mobileprovision", Buffer.from("foo", "utf-8"))
  expect(didCreateDirectory).toBeTruthy()
})

test("Does not create directory if it exists", () => {
  let didCreateDirectory = false
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.fileExistanceChecker = (filePath: string) => {
    return true
  }
  args.directoryCreator = (dir: string) => {
    didCreateDirectory = true
  }
  const store = new DiskProvisioningProfileStore(args)
  store.store("foo.mobileprovision", Buffer.from("foo", "utf-8"))
  expect(didCreateDirectory).not.toBeTruthy()
})

test("Writes file content", () => {
  let didWriteFile = false
  let writtenContent: Buffer | null = null
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.fileExistanceChecker = (filePath: string) => {
    return true
  }
  args.fileWriter = (filePath: string, content: Buffer) => {
    didWriteFile = true
    writtenContent = content
  }
  const store = new DiskProvisioningProfileStore(args)
  const content = Buffer.from("Hello world!", "utf-8")
  store.store("foo.mobileprovision", content)
  expect(didWriteFile).toBeTruthy()
  expect(writtenContent).toBe(content)
})

test("Removes file if it exists", () => {
  let didRemoveFile = false
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.fileExistanceChecker = (filePath: string) => {
    return true
  }
  args.fileRemover = (filePath: string) => {
    didRemoveFile = true
  }
  const store = new DiskProvisioningProfileStore(args)
  store.remove("foo.mobileprovision")
  expect(didRemoveFile).toBeTruthy()
})

test("Does not remove file if it does not exist", () => {
  let didRemoveFile = false
  const args = new MockDiskProvisioningProfileStoreArguments()
  args.fileExistanceChecker = (filePath: string) => {
    return false
  }
  args.fileRemover = (filePath: string) => {
    didRemoveFile = true
  }
  const store = new DiskProvisioningProfileStore(args)
  store.remove("foo.mobileprovision")
  expect(didRemoveFile).not.toBeTruthy()
})
