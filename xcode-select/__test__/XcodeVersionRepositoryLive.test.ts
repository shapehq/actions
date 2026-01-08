import MockFileSystem from "./mock/MockFileSystem"
import XcodeVersion from "../src/XcodeVersion/XcodeVersion"
import SemanticVersion from "../src/SemanticVersion/SemanticVersion"
import SemanticVersionParser from "../src/SemanticVersion/SemanticVersionParser"
import XcodeVersionParser from "../src/XcodeVersion/XcodeVersionParser"
import MockXcodeVersionParser from "./mock/MockXcodeVersionParser"
import FileSystemXcodeVersionRepository from "../src/XcodeVersion/FileSystemXcodeVersionRepository"
import MockPlistReader from "./mock/MockPlistReader"

test("It loads from global Applications folder and user's Applications folder", async () => {
  const fileSystem = new MockFileSystem("/Users/runner")
  const repository = new FileSystemXcodeVersionRepository({
    fileSystem: fileSystem,
    xcodeVersionParser: new MockXcodeVersionParser(),
    plistReader: new MockPlistReader()
  })
  await repository.getXcodeVersions()
  expect(fileSystem.listedDirectories).toEqual([
    "/Applications",
    "/Users/runner/Applications"
  ])
})

test("It parses Xcode version from file path", async () => {
  const fileSystem = new MockFileSystem()
  fileSystem.dirContents = [
    "/Users/runner/Applications/Xcode 14.3.app"
  ]
  const xcodeVersionParser = new MockXcodeVersionParser()
  const repository = new FileSystemXcodeVersionRepository({
    fileSystem,
    xcodeVersionParser,
    plistReader: new MockPlistReader()
  })
  await repository.getXcodeVersions()
  expect(xcodeVersionParser.latestFilePath).not.toBeNull()
})

test("It removes duplicate Xcode versions", async () => {
  const fileSystem = new MockFileSystem()
  fileSystem.dirContents = [
    "/Users/runner/Applications/Xcode 14.3.app",
    "/Users/runner/Applications/Xcode 14.3.0.app",
    "/Users/runner/Applications/Xcode 14.3.1.app"
  ]
  const semanticVersionParser = new SemanticVersionParser()
  const xcodeVersionParser = new XcodeVersionParser({ semanticVersionParser })
  const repository = new FileSystemXcodeVersionRepository({
    fileSystem,
    xcodeVersionParser,
    plistReader: new MockPlistReader()
  })
  const xcodeVersions = await repository.getXcodeVersions()
  expect(xcodeVersions.length).toBe(2)
})

test("It sorts Xcode versions", async () => {
  const fileSystem = new MockFileSystem()
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
  const xcodeVersionParser = new XcodeVersionParser({ semanticVersionParser })
  const repository = new FileSystemXcodeVersionRepository({
    fileSystem,
    xcodeVersionParser,
    plistReader: new MockPlistReader()
  })
  const xcodeVersions = await repository.getXcodeVersions()
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

test("It handles release candidate and beta being installed simultaneously", async () => {
  const fileSystem = new MockFileSystem()
  fileSystem.dirContents = [
    "/Users/runner/Applications/Xcode_16.4-RC.app",
    "/Users/runner/Applications/Xcode_16.4-Beta.app",
  ]
  const semanticVersionParser = new SemanticVersionParser()
  const xcodeVersionParser = new XcodeVersionParser({ semanticVersionParser })
  const repository = new FileSystemXcodeVersionRepository({
    fileSystem,
    xcodeVersionParser,
    plistReader: new MockPlistReader()
  })
  const xcodeVersions = await repository.getXcodeVersions()
  expect(xcodeVersions.length).toBe(2)
})
