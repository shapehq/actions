import ICommandRunner from "../../src/CommandRunner/ICommandRunner"

export default class MockCommandRunner implements ICommandRunner {
  public latestCmd: string | null = null
  
  async run(cmd: string[]): Promise<string> {
    this.latestCmd = cmd.join(" ")
    return ""
  }
}
