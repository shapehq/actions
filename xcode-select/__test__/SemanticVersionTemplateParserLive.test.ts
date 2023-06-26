import {SemanticVersionTemplatePlaceholder} from "../src/SemanticVersion/SemanticVersionTemplate"
import {SemanticVersionTemplateParserLive} from "../src/SemanticVersion/SemanticVersionTemplateParserLive"

test("It fails to parse template containing major only", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("14")).toThrow()
})

test("It fails to parse template containing four components", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("14.3.1.2")).toThrow()
})

test("It fails to parse template where major is not an integer", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("x.3")).toThrow()
})

test("It fails to parse template where minor is not an integer or a placeholder", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("14.a")).toThrow()
})

test("It fails to parse template where patch is not an integer or a placeholder", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("14.3.a")).toThrow()
})

test("It fails to parse template where minor is a placeholder but patch is absent", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("14.x")).toThrow()
})

test("It fails to parse template where minor is a placeholder but patch is a number", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("14.x.1")).toThrow()
})

test("It fails to parse template where patch is absent", () => {
  const parser = new SemanticVersionTemplateParserLive()
  expect(() => parser.parse("14.3")).toThrow()
})

test("It parses template with major and minor", () => {
  const parser = new SemanticVersionTemplateParserLive()
  const versionTemplate = parser.parse("14.3.0")
  expect(versionTemplate.major).toEqual(14)
  expect(versionTemplate.minor).toEqual(3)
  expect(versionTemplate.patch).toEqual(0)
})

test("It parses template with major, minor, and patch", () => {
  const parser = new SemanticVersionTemplateParserLive()
  const versionTemplate = parser.parse("14.3.1")
  expect(versionTemplate.major).toEqual(14)
  expect(versionTemplate.minor).toEqual(3)
  expect(versionTemplate.patch).toEqual(1)
})

test("It parses template with major, minor, and a placeholder patch", () => {
  const parser = new SemanticVersionTemplateParserLive()
  const versionTemplate = parser.parse("14.3.x")
  expect(versionTemplate.major).toEqual(14)
  expect(versionTemplate.minor).toEqual(3)
  expect(versionTemplate.patch).toEqual(SemanticVersionTemplatePlaceholder)
})

test("It parses template with major and placeholder  minor and patch", () => {
  const parser = new SemanticVersionTemplateParserLive()
  const versionTemplate = parser.parse("14.x.x")
  expect(versionTemplate.major).toEqual(14)
  expect(versionTemplate.minor).toEqual(SemanticVersionTemplatePlaceholder)
  expect(versionTemplate.patch).toEqual(SemanticVersionTemplatePlaceholder)
})