import * as core from "@actions/core"
import * as os from "os"
import * as path from "path"
import { existsSync, writeFileSync, unlinkSync } from "fs"
import { mkdir } from "./utils/mkdir"
import { generateFilename } from "./utils/generate-filename"
import { Action } from "./Action"
import { LiveProvisioningProfileInstaller } from "./LiveProvisioningProfileInstaller"
import { DiskProvisioningProfileStore } from "./DiskProvisioningProfileStore"
import { KeyValueStateStore } from "./KeyValueStateStore"
import { getOptions } from "./get-options"

const stateStore = new KeyValueStateStore(core)
const provisioningProfileStore = new DiskProvisioningProfileStore({
  dir: path.join(os.homedir(), "/Library/MobileDevice/Provisioning Profiles"),
  logger: core,
  fileExistanceChecker: existsSync,
  directoryCreator: mkdir,
  fileWriter: writeFileSync,
  fileRemover: unlinkSync
})
const provisioningProfileInstaller = new LiveProvisioningProfileInstaller(generateFilename, provisioningProfileStore)
const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller, core)
action.run(getOptions())