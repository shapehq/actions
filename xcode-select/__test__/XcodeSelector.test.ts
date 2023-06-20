import {XcodeSelectorLive} from "../src/XcodeSelector/XcodeSelectorLive"
import {CommandRunnerMock} from "./mock/CommandRunnerMock"

test("It parses version number with major only", async () => {
  const commandRunner = new CommandRunnerMock()
  const selector = new XcodeSelectorLive(commandRunner)
  await selector.select("/Users/runner/Applications/Xcode 14.3.app")
  const expectedCmd = "sudo xcode-select -s /Users/runner/Applications/Xcode 14.3.app/Contents/Developer"
  expect(commandRunner.latestCmd).toEqual(expectedCmd)
})
