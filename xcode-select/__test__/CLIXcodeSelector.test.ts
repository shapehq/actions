import CLIXcodeSelector from "../src/XcodeSelector/CLIXcodeSelector"
import MockCommandRunner from "./mock/MockCommandRunner"

test("It runs xcode-select on the command line", async () => {
  const commandRunner = new MockCommandRunner()
  const selector = new CLIXcodeSelector({ commandRunner })
  await selector.select("/Users/runner/Applications/Xcode 14.3.app")
  const expectedCmd = "sudo xcode-select -s /Users/runner/Applications/Xcode 14.3.app/Contents/Developer"
  expect(commandRunner.latestCmd).toEqual(expectedCmd)
})
