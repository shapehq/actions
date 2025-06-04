import IXcodeSelector from "./IXcodeSelector"
import ICommandRunner from "../CommandRunner/ICommandRunner"

export default class CLIXcodeSelector implements IXcodeSelector {
  private readonly commandRunner: ICommandRunner
  
  constructor(config: { commandRunner: ICommandRunner }) {
    this.commandRunner = config.commandRunner
  }
  
  async select(filePath: string) {
    const cmd = "sudo xcode-select -s " + filePath + "/Contents/Developer"
    await this.commandRunner.run(cmd)
  }
}
