import { exec, execFile } from "child_process"
import ICommandRunner from "./ICommandRunner"

export default class ExecCommandRunner implements ICommandRunner {
  run(cmd: string | string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      if (Array.isArray(cmd)) {
        execFile(cmd[0], cmd.slice(1), (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else if (stderr) {
            reject(stderr)
          } else {
            resolve(stdout)
          }
        })
      } else {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else if (stderr) {
            reject(stderr)
          } else {
            resolve(stdout)
          }
        })
      }
    })
  }
}
