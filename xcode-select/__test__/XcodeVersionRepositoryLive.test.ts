import FileSystemMock from "./mock/FileSystemMock"
import XcodeVersion from "../src/XcodeVersion/XcodeVersion"
import SemanticVersion from "../src/SemanticVersion/SemanticVersion"
import SemanticVersionParser from "../src/SemanticVersion/SemanticVersionParser"
import XcodeVersionParserLive from "../src/XcodeVersion/XcodeVersionParserLive"
import XcodeVersionParserMock from "./mock/XcodeVersionParserMock"
import XcodeVersionRepositoryLive from "../src/XcodeVersion/XcodeVersionRepositoryLive"

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

test("It removes duplicate Xcode versions", () => {
  const fileSystem = new FileSystemMock()
  fileSystem.dirContents = [
    "/Users/runner/Applications/Xcode 14.3.app",
    "/Users/runner/Applications/Xcode 14.3.0.app",
    "/Users/runner/Applications/Xcode 14.3.1.app"
  ]
  const semanticVersionParser = new SemanticVersionParser()
  const xcodeVersionParser = new XcodeVersionParserLive(semanticVersionParser)
  const repository = new XcodeVersionRepositoryLive(fileSystem, xcodeVersionParser)
  const xcodeVersions = repository.getXcodeVersions()
  expect(xcodeVersions.length).toBe(2)
})

test("It sorts Xcode versions", () => {
  const fileSystem = new FileSystemMock()
  fileSystem.dirContents = [
    "/Users/runner/Applications/Xcode 13.0.1.app",
    "/Users/runner/Applications/Xcode 13.0.app",
    "/Users/runner/Applications/Xcode 14.3.0.app",
    "/Users/runner/Applications/Xcode 14.2.1.app",
    "/Users/runner/Applications/Xcode 14.3.2.app",
    "/Users/runner/Applications/Xcode 15.0.1_Beta.2.app",
    "/Users/runner/Applications/Xcode 15.0.1_Beta.1.app",
    "/Users/runner/Applications/Xcode 15.0.0.app"
  ]
  const semanticVersionParser = new SemanticVersionParser()
  const xcodeVersionParser = new XcodeVersionParserLive(semanticVersionParser)
  const repository = new XcodeVersionRepositoryLive(fileSystem, xcodeVersionParser)
  const xcodeVersions = repository.getXcodeVersions()
  expect(xcodeVersions).toStrictEqual([
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 13.0.app",
      new SemanticVersion(13, 0, 0)
    ),
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 13.0.1.app",
      new SemanticVersion(13, 0, 1)
    ),
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 14.2.1.app",
      new SemanticVersion(14, 2, 1)
    ),
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 14.3.0.app",
      new SemanticVersion(14, 3, 0)
    ),
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 14.3.2.app",
      new SemanticVersion(14, 3, 2)
    ),
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 15.0.0.app",
      new SemanticVersion(15, 0, 0)
    ),
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 15.0.1_Beta.1.app",
      new SemanticVersion(15, 0, 1),
      true,
      1
    ),
    new XcodeVersion(
      "/Users/runner/Applications/Xcode 15.0.1_Beta.2.app",
      new SemanticVersion(15, 0, 1),
      true,
      2
    )
  ])
})
