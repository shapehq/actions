import * as core from "@actions/core"
import {ActionOptions} from "./Action"

export function getOptions(): ActionOptions {
  return {
    version: core.getInput("version")
  }
}
