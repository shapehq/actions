import * as core from "@actions/core"
import { decodeBase64 } from "./utils/decode-base64"
import { generateFilename } from "./utils/generate-filename"
import { makeDir } from "./utils/make-dir"
import { removeFile } from "./utils/remove-file"
import { writeFile } from "./utils/write-file"
import { Action } from "./Action"
import { StateStore } from "./StateStore"
import { ProfileInstaller } from "./ProfileInstaller"
import { ProfileUninstaller } from "./ProfileUninstaller"
import { Logger } from "./Logger"
import { getOptions } from "./get-options"

const stateStore = new StateStore(core)
const logger = new Logger(core)
const profileInstaller = new ProfileInstaller(generateFilename, decodeBase64, makeDir, writeFile, logger)
const profileUninstaller = new ProfileUninstaller(removeFile, logger)
const action = new Action(stateStore, profileInstaller, profileUninstaller)
action.run(getOptions())