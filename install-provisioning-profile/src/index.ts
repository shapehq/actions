import * as core from "@actions/core"
import * as os from "os"
import * as path from "path"
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs"
import { decodeBase64 } from "./utils/decode-base64"
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
  directoryCreator: (dir: string) => mkdirSync(dir, { recursive: true }),
  fileWriter: writeFileSync,
  fileRemover: unlinkSync
})
const provisioningProfileInstaller = new LiveProvisioningProfileInstaller(
  generateFilename, 
  decodeBase64, 
  provisioningProfileStore
)
const action = new Action(stateStore, provisioningProfileStore, provisioningProfileInstaller)
action.run(getOptions())