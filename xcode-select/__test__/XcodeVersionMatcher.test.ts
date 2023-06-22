import {SemanticVersion} from "../src/SemanticVersion/SemanticVersion"
import {
  SemanticVersionTemplate, SemanticVersionTemplatePlaceholder
} from "../src/SemanticVersion/SemanticVersionTemplate"
import {XcodeVersionRepositoryMock} from "./mock/XcodeVersionRepositoryMock"
import {XcodeVersionMatcher} from "../src/XcodeVersion/XcodeVersionMatcher"

test("It throws when repository is empty", () => {
  const repository = new XcodeVersionRepositoryMock()
  const needle = new SemanticVersionTemplate(14, 3, 1)
  const matcher = new XcodeVersionMatcher(repository)
  expect(() => matcher.findXcodeVersion(needle)).toThrow()
})

test("It finds version based on major component", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle = new SemanticVersionTemplate(14, SemanticVersionTemplatePlaceholder, SemanticVersionTemplatePlaceholder)
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).not.toBeNull()
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toEqual(1)
})

test("It finds version based on major and minor components", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle = new SemanticVersionTemplate(14, 3, SemanticVersionTemplatePlaceholder)
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).not.toBeNull()
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toEqual(2)
})

test("It finds version based on major, minor, and patch components", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle = new SemanticVersionTemplate(14, 3, 1)
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).not.toBeNull()
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toEqual(1)
})

test("It throws when no version matches major, minor, and patch components", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle = new SemanticVersionTemplate(14, 3, 4)
  const matcher = new XcodeVersionMatcher(repository)
  expect(() => matcher.findXcodeVersion(needle)).toThrow()
})

test("It throws when no version matches major and minor components", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle = new SemanticVersionTemplate(14, 5, SemanticVersionTemplatePlaceholder)
  const matcher = new XcodeVersionMatcher(repository)
  expect(() => matcher.findXcodeVersion(needle)).toThrow()
})

test("It throws when no version matches major component", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle = new SemanticVersionTemplate(16, SemanticVersionTemplatePlaceholder, SemanticVersionTemplatePlaceholder)
  const matcher = new XcodeVersionMatcher(repository)
  expect(() => matcher.findXcodeVersion(needle)).toThrow()
})
