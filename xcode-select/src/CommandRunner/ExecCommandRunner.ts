import { execFile } from "child_process"
import ICommandRunner from "./ICommandRunner.js"

export default class ExecCommandRunner implements ICommandRunner {
  run(cmd: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      execFile(cmd[0], cmd.slice(1), (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else if (stderr) {
          reject(stderr)
        } else {
          resolve(stdout)
        }
      })
    })
  }
}
