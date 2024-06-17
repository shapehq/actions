import * as core from "@actions/core"
import Action from "./Action"
import { getOptions } from "./get-options"

const action = new Action({ logger: core })
action.run(getOptions()).catch(err => {
  core.setFailed(err.toString())
})
