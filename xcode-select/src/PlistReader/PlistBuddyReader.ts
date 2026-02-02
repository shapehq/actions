import ICommandRunner from "../CommandRunner/ICommandRunner.js"
import IPlistReader from "./IPlistReader.js"

export default class PlistBuddyReader implements IPlistReader {
  private readonly commandRunner: ICommandRunner

  constructor(config: { commandRunner: ICommandRunner }) {
    this.commandRunner = config.commandRunner
  }

  async getValue(filePath: string, key: string): Promise<string | null> {
    try {
      const output = await this.commandRunner.run([
        "/usr/libexec/PlistBuddy",
        "-c",
        `Print :${key}`,
        filePath
      ])
      const value = output.trim()
      return value.length > 0 ? value : null
    } catch {
      return null
    }
  }
}
