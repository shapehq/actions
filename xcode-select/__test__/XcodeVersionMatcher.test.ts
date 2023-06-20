import {SemanticVersion} from "../src/SemanticVersion/SemanticVersion"
import {XcodeVersionRepositoryMock} from "./mock/XcodeVersionRepositoryMock"
import {XcodeVersionMatcher} from "../src/XcodeVersion/XcodeVersionMatcher"

test("It returns null when repository is empty", () => {
  const repository = new XcodeVersionRepositoryMock()
  const needle: SemanticVersion = {major: 14, minor: null, patch: null}
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).toBeNull()
})

test("It finds version based on major component", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle: SemanticVersion = {major: 14, minor: null, patch: null}
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
  const needle: SemanticVersion = {major: 14, minor: 3, patch: null}
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
  const needle: SemanticVersion = {major: 14, minor: 3, patch: 1}
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).not.toBeNull()
  expect(xcodeVersion?.version.major).toEqual(14)
  expect(xcodeVersion?.version.minor).toEqual(3)
  expect(xcodeVersion?.version.patch).toEqual(1)
})

test("It returns null when no version matches major, minor, and patch components", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle: SemanticVersion = {major: 14, minor: 3, patch: 4}
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).toBeNull()
})

test("It returns null when no version matches major and minor components", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle: SemanticVersion = {major: 14, minor: 5, patch: null}
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).toBeNull()
})

test("It returns null when no version matches major component", () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15)
  repository.addXcodeVersion(14, 4, 2)
  repository.addXcodeVersion(14, 3, 2)
  repository.addXcodeVersion(14, 3, 1)
  repository.addXcodeVersion(14, 3)
  repository.addXcodeVersion(13, 4, 1)
  const needle: SemanticVersion = {major: 16, minor: null, patch: null}
  const matcher = new XcodeVersionMatcher(repository)
  const xcodeVersion = matcher.findXcodeVersion(needle)
  expect(xcodeVersion).toBeNull()
})
