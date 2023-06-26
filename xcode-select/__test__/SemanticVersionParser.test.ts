import {SemanticVersionParser} from "../src/SemanticVersion/SemanticVersionParser"

test("It parses version number with major only", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("14")
  expect(version?.major).toEqual(14)
  expect(version?.minor).toEqual(0)
  expect(version?.patch).toEqual(0)
})

test("It parses version number with major and minor", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("14.3")
  expect(version?.major).toEqual(14)
  expect(version?.minor).toEqual(3)
  expect(version?.patch).toEqual(0)
})

test("It parses version number with major, minor, and patch", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("14.3.1")
  expect(version?.major).toEqual(14)
  expect(version?.minor).toEqual(3)
  expect(version?.patch).toEqual(1)
})

test("It returns null when encountering too many components", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("14.3.1.2")
  expect(version).toBeNull()
})

test("It returns null when given invalid major", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("foo")
  expect(version).toBeNull()
})

test("It returns null when given invalid minor", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("14.foo")
  expect(version).toBeNull()
})

test("It returns null when given invalid patch", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("14.3.foo")
  expect(version).toBeNull()
})

test("It returns null when version number is absent", () => {
  const parser = new SemanticVersionParser()
  const version = parser.parse("")
  expect(version).toBeNull()
})
