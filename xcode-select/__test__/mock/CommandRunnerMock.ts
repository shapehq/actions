import {CommandRunner} from "../../src/CommandRunner/CommandRunner"

export class CommandRunnerMock implements CommandRunner {
  public latestCmd: string | null = null
  
  async run(cmd: string): Promise<string> {
    this.latestCmd = cmd
    return ""
  }
}
