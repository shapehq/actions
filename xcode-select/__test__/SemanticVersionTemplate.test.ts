import SemanticVersionTemplate, {
  SemanticVersionTemplatePlaceholder
} from "../src/SemanticVersion/SemanticVersionTemplate"

test("It constructs a display string given major, minor, and patch", () => {
  const version = new SemanticVersionTemplate(14, 3, 1)
  expect(version.displayString).toEqual("14.3.1")
})

test("It constructs a display string given major and minor", () => {
  const version = new SemanticVersionTemplate(14, 3, 0)
  expect(version.displayString).toEqual("14.3.0")
})

test("It constructs a display string given major and minor and a placeholder value patch", () => {
  const version = new SemanticVersionTemplate(14, 3, SemanticVersionTemplatePlaceholder)
  expect(version.displayString).toEqual("14.3.x")
})

test("It constructs a display string given major and placeholder values for minor and patch", () => {
  const version = new SemanticVersionTemplate(14, SemanticVersionTemplatePlaceholder, SemanticVersionTemplatePlaceholder)
  expect(version.displayString).toEqual("14.x.x")
})
