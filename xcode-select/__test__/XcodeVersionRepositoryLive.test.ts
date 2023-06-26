import {FileSystemMock} from "./mock/FileSystemMock"
import {XcodeVersionParserMock} from "./mock/XcodeVersionParserMock"
import {XcodeVersionRepositoryLive} from "../src/XcodeVersion/XcodeVersionRepositoryLive"

test("It loads from global Applications folder and user's Applications folder", () => {
  const fileSystem = new FileSystemMock("/Users/runner")
  const repository = new XcodeVersionRepositoryLive(
    fileSystem,
    new XcodeVersionParserMock()
  )
  repository.getXcodeVersions()
  expect(fileSystem.listedDirectories).toEqual([
    "/Applications",
    "/Users/runner/Applications"
  ])
})

test("It parses Xcode version from file path", () => {
  const fileSystem = new FileSystemMock()
  fileSystem.dirContents = [
    "/Users/runner/Applications/Xcode 14.3.app"
  ]
  const xcodeVersionParser = new XcodeVersionParserMock()
  const repository = new XcodeVersionRepositoryLive(fileSystem, xcodeVersionParser)
  repository.getXcodeVersions()
  expect(xcodeVersionParser.latestFilePath).not.toBeNull()
})
