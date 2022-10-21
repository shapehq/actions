import * as core from "@actions/core"
import { ActionOptions } from "./Action"

export function getOptions(): ActionOptions {
  return {
    profileBase64: core.getInput("profile-base64"),
    filename: core.getInput("filename")
  }
}