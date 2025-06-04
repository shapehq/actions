import XcodeSelector from "./XcodeSelector"
import CommandRunner from "../CommandRunner/CommandRunner"

export default class XcodeSelectorLive implements XcodeSelector {
  private readonly commandRunner: CommandRunner
  
  constructor(config: { commandRunner: CommandRunner }) {
    this.commandRunner = config.commandRunner
  }
  
  async select(filePath: string) {
    const cmd = "sudo xcode-select -s " + filePath + "/Contents/Developer"
    await this.commandRunner.run(cmd)
  }
}
