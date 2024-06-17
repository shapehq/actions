import * as core from "@actions/core"
import { ActionOptions } from "./Action"

export function getOptions(): ActionOptions {
  return {
    searchDir: core.getInput("search-dir"),
    style: core.getInput("style")
  }
}
