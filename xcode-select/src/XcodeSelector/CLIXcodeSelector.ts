import IXcodeSelector from "./IXcodeSelector"
import ICommandRunner from "../CommandRunner/ICommandRunner"

export default class CLIXcodeSelector implements IXcodeSelector {
  private readonly commandRunner: ICommandRunner
  
  constructor(config: { commandRunner: ICommandRunner }) {
    this.commandRunner = config.commandRunner
  }
  
  async select(filePath: string) {
    await this.commandRunner.run([
      "sudo",
      "xcode-select",
      "-s",
      filePath + "/Contents/Developer"
    ])
  }
}
