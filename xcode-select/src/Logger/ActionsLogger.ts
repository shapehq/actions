import * as core from "@actions/core"
import ILogger from "./ILogger"

export default class ActionsLogger implements ILogger {
  log(message: string) {
    console.log(message)
  }
  
  error(message: string) {
    core.setFailed(message)
  }
}
