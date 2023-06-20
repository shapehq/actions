import {Action} from "../src/Action"
import {ActionOptionsMock} from "./mock/ActionOptionsMock"
import {StateStoreMock} from "./mock/StateStoreMock"
import {LoggerMock} from "./mock/LoggerMock"
import {SemanticVersionParser} from "../src/SemanticVersion/SemanticVersionParser"
import {XcodeVersionRepositoryMock} from "./mock/XcodeVersionRepositoryMock"
import {XcodeVersionMatcher} from "../src/XcodeVersion/XcodeVersionMatcher"
import {XcodeSelectorMock} from "./mock/XcodeSelectorMock"

test("It enters post-phase after running main-phase", async () => {
  const stateStore = new StateStoreMock()
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3)
  const action = new Action(
    stateStore,
    new LoggerMock(),
    new SemanticVersionParser(),
    repository,
    new XcodeVersionMatcher(repository),
    new XcodeSelectorMock()
  )
  expect(stateStore.isPost).not.toBeTruthy()
  const options = new ActionOptionsMock("14.3")
  await action.run(options)
  expect(stateStore.isPost).toBeTruthy()
})

test("It throws when given invalid version", async () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3)
  const action = new Action(
    new StateStoreMock(),
    new LoggerMock(),
    new SemanticVersionParser(),
    repository,
    new XcodeVersionMatcher(repository),
    new XcodeSelectorMock()
  )
  const options = new ActionOptionsMock("foo")
  expect(action.run(options)).rejects.toThrow()
})

test("It throws error when Xcode version not found", async () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3)
  const action = new Action(
    new StateStoreMock(),
    new LoggerMock(),
    new SemanticVersionParser(),
    repository,
    new XcodeVersionMatcher(repository),
    new XcodeSelectorMock()
  )
  const options = new ActionOptionsMock("15.0")
  expect(action.run(options)).rejects.toThrow()
})

test("It selects an Xcode version", async () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3, 1)
  const selector = new XcodeSelectorMock()
  const action = new Action(
    new StateStoreMock(),
    new LoggerMock(),
    new SemanticVersionParser(),
    repository,
    new XcodeVersionMatcher(repository),
    selector
  )
  const options = new ActionOptionsMock("14.3.1")
  await action.run(options)
  expect(selector.selectedFilePath).toEqual("/Users/runner/Applications/Xcode 14.3.1.app")
})
