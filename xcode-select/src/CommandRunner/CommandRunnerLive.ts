import {exec} from "child_process"
import {CommandRunner} from "./CommandRunner"

export class CommandRunnerLive implements CommandRunner {
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
