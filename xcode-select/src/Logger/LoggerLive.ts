import * as core from "@actions/core"
import {Logger} from "./Logger"

export class LoggerLive implements Logger {
  log(message: string) {
    console.log(message)
  }
  
  error(message: string) {
    core.setFailed(message)
  }
}
