import { generateFilename } from "../src/utils/generate-filename"

test("Suffix added to base filename without suffix", () => {
  expect(generateFilename("myProfile")).toEqual("myProfile.mobileprovision")
})

test("Suffix not added to base filename already containing suffix", () => {
  expect(generateFilename("myProfile.mobileprovision")).toEqual("myProfile.mobileprovision")
})

test("Base filename being kept", () => {
  expect(generateFilename("foo.mobileprovision")).toEqual("foo.mobileprovision")
})

test("Random filenames has suffix", () => {
  expect(generateFilename().endsWith(".mobileprovision")).toBeTruthy()
})

test("Random filenames are unique", () => {
  const filenameA = generateFilename()
  const filenameB = generateFilename()
  expect(filenameA).not.toBe(filenameB)
})
