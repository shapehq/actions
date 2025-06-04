import XcodeSelector from "./XcodeSelector"
import CommandRunner from "../CommandRunner/CommandRunner"

export default class XcodeSelectorLive implements XcodeSelector {
  private commandRunner: CommandRunner
  
  constructor(commandRunner: CommandRunner) {
    this.commandRunner = commandRunner
  }
  
  async select(filePath: string) {
    const cmd = "sudo xcode-select -s " + filePath + "/Contents/Developer"
    await this.commandRunner.run(cmd)
  }
}
