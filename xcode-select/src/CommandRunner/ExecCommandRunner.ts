import { exec } from "child_process"
import ICommandRunner from "./ICommandRunner"

export default class ExecCommandRunner implements ICommandRunner {
  run(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
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
