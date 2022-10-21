import { decodeBase64 } from "./utils/decode-base64"
import { generateFilename } from "./utils/generate-filename"
import { makeDir } from "./utils/make-dir"
import { removeFile } from "./utils/remove-file"
import { writeFile } from "./utils/write-file"
import { Action } from "./Action"
import { CoreStateStore } from "./state/CoreStateStore"
import { ProfileInstaller } from "./ProfileInstaller"
import { ProfileUninstaller } from "./ProfileUninstaller"
import { getOptions } from "./get-options"

const stateStore = new CoreStateStore()
const profileInstaller = new ProfileInstaller(generateFilename, decodeBase64, makeDir, writeFile)
const profileUninstaller = new ProfileUninstaller(removeFile)
const action = new Action(stateStore, profileInstaller, profileUninstaller)
action.run(getOptions())