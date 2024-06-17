import * as core from "@actions/core"
import Action, { ActionLogger } from "./Action"
import { getOptions } from "./get-options"

const logger: ActionLogger = {
  log(message) {
    console.log(message)
  },
  setFailed(message) {
    core.setFailed(message)
  }
}

const action = new Action({ logger })
action.run(getOptions()).catch(err => {
  core.setFailed(err.toString())
})
