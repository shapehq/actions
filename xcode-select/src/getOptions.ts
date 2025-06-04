import * as core from "@actions/core"
import { ActionOptions } from "./Action"

export default function getOptions(): ActionOptions {
  return {
    version: core.getInput("version")
  }
}
