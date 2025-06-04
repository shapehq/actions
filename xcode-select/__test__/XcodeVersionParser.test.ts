import SemanticVersionParser from "../src/SemanticVersion/SemanticVersionParser"
import XcodeVersionParser from "../src/XcodeVersion/XcodeVersionParser"

test("It parses XcodeVersion with major only", () => {
  const filePath = "/Users/runner/Applications/Xcode 14.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 14.0.0")
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(0)
  expect(xcodeVersion?.version.patch).toEqual(0)
  expect(xcodeVersion?.isBeta).toBeFalsy()
  expect(xcodeVersion?.betaNumber).toBeNull()
})

test("It parses XcodeVersion with major and minor", () => {
  const filePath = "/Users/runner/Applications/Xcode 14.3.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 14.3.0")
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toEqual(0)
  expect(xcodeVersion?.isBeta).toBeFalsy()
  expect(xcodeVersion?.betaNumber).toBeNull()
})

test("It parses XcodeVersion with major, minor, and patch", () => {
  const filePath = "/Users/runner/Applications/Xcode 14.3.1.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 14.3.1")
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toEqual(1)
  expect(xcodeVersion?.isBeta).toBeFalsy()
  expect(xcodeVersion?.betaNumber).toBeNull()
})

test("It parses XcodeVersion for beta version", () => {
  const filePath = "/Users/runner/Applications/Xcode 15 beta.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15.0.0 Beta")
  expect(xcodeVersion?.version.major).toEqual(15)
  expect(xcodeVersion?.version.minor).toEqual(0)
  expect(xcodeVersion?.version.patch).toEqual(0)
  expect(xcodeVersion?.isBeta).toBeTruthy()
  expect(xcodeVersion?.betaNumber).toBeNull()
})

test("It parses XcodeVersion for release candidate", () => {
  const filePath = "/Users/runner/Applications/Xcode-15.0.0-Release.Candidate.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15.0.0")
  expect(xcodeVersion?.version.major).toEqual(15)
  expect(xcodeVersion?.version.minor).toEqual(0)
  expect(xcodeVersion?.version.patch).toEqual(0)
  expect(xcodeVersion?.isBeta).toBeFalsy()
  expect(xcodeVersion?.betaNumber).toBeNull()
})

test("It parses XcodeVersion for abbreviated release candidate", () => {
  const filePath = "/Users/runner/Applications/Xcode-15.0.0-RC.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15.0.0")
  expect(xcodeVersion?.version.major).toEqual(15)
  expect(xcodeVersion?.version.minor).toEqual(0)
  expect(xcodeVersion?.version.patch).toEqual(0)
  expect(xcodeVersion?.isBeta).toBeFalsy()
  expect(xcodeVersion?.betaNumber).toBeNull()
})

test("It parses XcodeVersion for 2nd beta version", () => {
  const filePath = "/Users/runner/Applications/Xcode_15.0.0_Beta.2.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15.0.0 Beta 2")
  expect(xcodeVersion?.version.major).toEqual(15)
  expect(xcodeVersion?.version.minor).toEqual(0)
  expect(xcodeVersion?.version.patch).toEqual(0)
  expect(xcodeVersion?.isBeta).toBeTruthy()
  expect(xcodeVersion?.betaNumber).toEqual(2)
})

test("It returns null for other apps", () => {
  const filePath = "/Users/runner/Applications/Calendar.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion).toBeNull()
})

test("It returns null when version number is absent", () => {
  const filePath = "/Users/runner/Applications/Xcode.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion).toBeNull()
})

test("It replaces multiple underscores in Xcode's name", () => {
  const filePath = "/Users/runner/Applications/Xcode_15.0.0_Beta.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15.0.0 Beta")
})

test("It replaces multiple dashes in Xcode's name", () => {
  const filePath = "/Users/runner/Applications/Xcode-15.0.0-Beta.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15.0.0 Beta")
})

test("It supports a combination of underscore and dashes", async () => {
  const filePath = "/Users/runner/Applications/Xcode_15.0.0-Beta.app"
  const parser = new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  })
  const xcodeVersion = parser.parseFilePath(filePath)
  expect(xcodeVersion?.name).toEqual("Xcode 15.0.0 Beta")
})
