import {SemanticVersion, semanticVersionSort} from "../src/SemanticVersion/SemanticVersion"

test("It constructs a display string given major, minor, and patch", () => {
  const version = new SemanticVersion(14, 3, 1)
  expect(version.displayString).toEqual("14.3.1")
})

test("It constructs a display string given major and minor", () => {
  const version = new SemanticVersion(14, 3, null)
  expect(version.displayString).toEqual("14.3.0")
})

test("It constructs a display string given major only", () => {
  const version = new SemanticVersion(14, null, null)
  expect(version.displayString).toEqual("14.0.0")
})

test("It constructs a display string given major and patch", () => {
  const version = new SemanticVersion(14, null, 1)
  expect(version.displayString).toEqual("14.0.1")
})

test("It sorts array of semantic versions", () => {
  expect(
    [
      new SemanticVersion(14, 3, 1),
      new SemanticVersion(14, 3, 0),
      new SemanticVersion(15, 0, 0),
      new SemanticVersion(13, 1, 2),
      new SemanticVersion(13, 2, 4)
    ].sort(semanticVersionSort)
  ).toEqual([
    new SemanticVersion(13, 1, 2),
    new SemanticVersion(13, 2, 4),
    new SemanticVersion(14, 3, 0),
    new SemanticVersion(14, 3, 1),
    new SemanticVersion(15, 0, 0)
  ])
})

test("It sorts array of semantic versions with null components", () => {
  expect(
    [
      new SemanticVersion(14, 3, 1),
      new SemanticVersion(14, 3, null),
      new SemanticVersion(15, null, null),
      new SemanticVersion(13, 1, 2),
      new SemanticVersion(13, 2, 4)
    ].sort(semanticVersionSort)
  ).toEqual([
    new SemanticVersion(13, 1, 2),
    new SemanticVersion(13, 2, 4),
    new SemanticVersion(14, 3, null),
    new SemanticVersion(14, 3, 1),
    new SemanticVersion(15, null, null)
  ])
})
