import {XcodeVersion} from "../src/XcodeVersion/XcodeVersion"
import {SemanticVersion} from "../src/SemanticVersion/SemanticVersion"

test("It constructs a name for non-beta Xcode version", () => {
  const xcodeVersion = new XcodeVersion(
    "/Users/runner/foo",
    new SemanticVersion(14, 3, 1),
    false
  )
  expect(xcodeVersion.name).toEqual("Xcode 14.3.1")
})

test("It constructs a name for beta Xcode version", () => {
  const xcodeVersion = new XcodeVersion(
    "/Users/runner/foo",
    new SemanticVersion(14, 3, 1),
    true
  )
  expect(xcodeVersion.name).toEqual("Xcode 14.3.1 Beta")
})
