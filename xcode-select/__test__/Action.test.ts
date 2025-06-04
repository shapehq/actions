import Action from "../src/Action"
import ActionOptionsMock from "./mock/ActionOptionsMock"
import StateStoreMock from "./mock/StateStoreMock"
import LoggerMock from "./mock/LoggerMock"
import SemanticVersionTemplateParserLive from "../src/SemanticVersion/SemanticVersionTemplateParserLive"
import XcodeVersionRepositoryMock from "./mock/XcodeVersionRepositoryMock"
import XcodeVersionMatcher from "../src/XcodeVersion/XcodeVersionMatcher"
import XcodeSelectorMock from "./mock/XcodeSelectorMock"

test("It enters post-phase after running main-phase", async () => {
  const stateStore = new StateStoreMock()
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3)
  const action = new Action({
    stateStore: stateStore,
    logger: new LoggerMock(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParserLive(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: new XcodeSelectorMock()
  })
  expect(stateStore.isPost).not.toBeTruthy()
  const options = new ActionOptionsMock("14.3.x")
  await action.run(options)
  expect(stateStore.isPost).toBeTruthy()
})

test("It throws when given invalid version", async () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3)
  const action = new Action({
    stateStore: new StateStoreMock(),
    logger: new LoggerMock(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParserLive(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: new XcodeSelectorMock()
  })
  const options = new ActionOptionsMock("foo")
  expect(action.run(options)).rejects.toThrow()
})

test("It throws error when Xcode version not found", async () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3)
  const action = new Action({
    stateStore: new StateStoreMock(),
    logger: new LoggerMock(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParserLive(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: new XcodeSelectorMock()
  })
  const options = new ActionOptionsMock("15.0")
  expect(action.run(options)).rejects.toThrow()
})

test("It selects an Xcode version", async () => {
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3, 1)
  const selector = new XcodeSelectorMock()
  const action = new Action({
    stateStore: new StateStoreMock(),
    logger: new LoggerMock(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParserLive(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: selector
  })
  const options = new ActionOptionsMock("14.3.1")
  await action.run(options)
  expect(selector.selectedFilePath).toEqual("/Users/runner/Applications/Xcode 14.3.1.app")
})

test("It logs message after selecting Xcode version", async () => {
  const logger = new LoggerMock()
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(14, 3, 1)
  const selector = new XcodeSelectorMock()
  const action = new Action({
    stateStore: new StateStoreMock(),
    logger: logger,
    semanticVersionTemplateParser: new SemanticVersionTemplateParserLive(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: selector
  })
  const options = new ActionOptionsMock("14.3.1")
  await action.run(options)
  expect(logger.latestLogMessage).not.toBeNull()
  expect(logger.latestLogMessage).toContain("Xcode 14.3.1")
})

test("It logs message after selecting beta version of Xcode", async () => {
  const logger = new LoggerMock()
  const repository = new XcodeVersionRepositoryMock()
  repository.addXcodeVersion(15, 0, 0, true)
  const selector = new XcodeSelectorMock()
  const action = new Action({
    stateStore: new StateStoreMock(),
    logger: logger,
    semanticVersionTemplateParser: new SemanticVersionTemplateParserLive(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: selector
  })
  const options = new ActionOptionsMock("15.x.x")
  await action.run(options)
  expect(logger.latestLogMessage).not.toBeNull()
  expect(logger.latestLogMessage).toContain("Xcode 15.0.0 Beta")
})
