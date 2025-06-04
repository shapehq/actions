import Action from "../src/Action"
import MockActionOptions from "./mock/MockActionOptions"
import MockStateStore from "./mock/MockStateStore"
import MockLogger from "./mock/MockLogger"
import SemanticVersionTemplateParser from "../src/SemanticVersion/SemanticVersionTemplateParser"
import MockXcodeVersionRepository from "./mock/MockXcodeVersionRepository"
import XcodeVersionMatcher from "../src/XcodeVersion/XcodeVersionMatcher"
import MockXcodeSelector from "./mock/MockXcodeSelector"

test("It enters post-phase after running main-phase", async () => {
  const stateStore = new MockStateStore()
  const repository = new MockXcodeVersionRepository()
  repository.addXcodeVersion(14, 3)
  const action = new Action({
    stateStore: stateStore,
    logger: new MockLogger(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParser(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: new MockXcodeSelector()
  })
  expect(stateStore.isPost).not.toBeTruthy()
  const options = new MockActionOptions("14.3.x")
  await action.run(options)
  expect(stateStore.isPost).toBeTruthy()
})

test("It throws when given invalid version", async () => {
  const repository = new MockXcodeVersionRepository()
  repository.addXcodeVersion(14, 3)
  const action = new Action({
    stateStore: new MockStateStore(),
    logger: new MockLogger(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParser(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: new MockXcodeSelector()
  })
  const options = new MockActionOptions("foo")
  expect(action.run(options)).rejects.toThrow()
})

test("It throws error when Xcode version not found", async () => {
  const repository = new MockXcodeVersionRepository()
  repository.addXcodeVersion(14, 3)
  const action = new Action({
    stateStore: new MockStateStore(),
    logger: new MockLogger(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParser(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: new MockXcodeSelector()
  })
  const options = new MockActionOptions("15.0")
  expect(action.run(options)).rejects.toThrow()
})

test("It selects an Xcode version", async () => {
  const repository = new MockXcodeVersionRepository()
  repository.addXcodeVersion(14, 3, 1)
  const selector = new MockXcodeSelector()
  const action = new Action({
    stateStore: new MockStateStore(),
    logger: new MockLogger(),
    semanticVersionTemplateParser: new SemanticVersionTemplateParser(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: selector
  })
  const options = new MockActionOptions("14.3.1")
  await action.run(options)
  expect(selector.selectedFilePath).toEqual("/Users/runner/Applications/Xcode 14.3.1.app")
})

test("It logs message after selecting Xcode version", async () => {
  const logger = new MockLogger()
  const repository = new MockXcodeVersionRepository()
  repository.addXcodeVersion(14, 3, 1)
  const selector = new MockXcodeSelector()
  const action = new Action({
    stateStore: new MockStateStore(),
    logger: logger,
    semanticVersionTemplateParser: new SemanticVersionTemplateParser(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: selector
  })
  const options = new MockActionOptions("14.3.1")
  await action.run(options)
  expect(logger.latestLogMessage).not.toBeNull()
  expect(logger.latestLogMessage).toContain("Xcode 14.3.1")
})

test("It logs message after selecting beta version of Xcode", async () => {
  const logger = new MockLogger()
  const repository = new MockXcodeVersionRepository()
  repository.addXcodeVersion(15, 0, 0, true)
  const selector = new MockXcodeSelector()
  const action = new Action({
    stateStore: new MockStateStore(),
    logger: logger,
    semanticVersionTemplateParser: new SemanticVersionTemplateParser(),
    xcodeVersionRepository: repository,
    xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository: repository }),
    xcodeSelector: selector
  })
  const options = new MockActionOptions("15.x.x")
  await action.run(options)
  expect(logger.latestLogMessage).not.toBeNull()
  expect(logger.latestLogMessage).toContain("Xcode 15.0.0 Beta")
})
