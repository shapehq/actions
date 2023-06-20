import {SemanticVersionParser} from "../src/SemanticVersion/SemanticVersionParser"
import {XcodeVersionParserLive} from "../src/XcodeVersion/XcodeVersionParserLive"

test("It parses XcodeVersion with major only", () => {
  const filePath = "/Users/runner/Applications/Xcode 14.app"
  const parser = new XcodeVersionParserLive(new SemanticVersionParser())
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 14")
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toBeNull()
  expect(xcodeVersion?.version.patch).toBeNull()
})

test("It parses XcodeVersion with major and minor", () => {
  const filePath = "/Users/runner/Applications/Xcode 14.3.app"
  const parser = new XcodeVersionParserLive(new SemanticVersionParser())
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 14.3")
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toBeNull()
})

test("It parses XcodeVersion with major, minor, and patch", () => {
  const filePath = "/Users/runner/Applications/Xcode 14.3.1.app"
  const parser = new XcodeVersionParserLive(new SemanticVersionParser())
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 14.3.1")
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toEqual(1)
})

test("It parses XcodeVersion for beta version", () => {
  const filePath = "/Users/runner/Applications/Xcode 15 beta.app"
  const parser = new XcodeVersionParserLive(new SemanticVersionParser())
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15 beta")
  expect(xcodeVersion?.version.major).toEqual(15)
  expect(xcodeVersion?.version.minor).toBeNull()
  expect(xcodeVersion?.version.patch).toBeNull()
})

test("It returns null for other apps", () => {
  const filePath = "/Users/runner/Applications/Calendar.app"
  const parser = new XcodeVersionParserLive(new SemanticVersionParser())
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion).toBeNull()
})

test("It returns null when version number is absent", () => {
  const filePath = "/Users/runner/Applications/Xcode.app"
  const parser = new XcodeVersionParserLive(new SemanticVersionParser())
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion).toBeNull()
})
