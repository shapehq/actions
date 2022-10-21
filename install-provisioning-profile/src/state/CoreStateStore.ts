import * as core from "@actions/core"
import { StateStore } from "./StateStore"

const KEY = {
  IS_POST: "isPost",
  PROVISIONING_PROFILE_PATH: "provisioningProfilePath"
}

export class CoreStateStore implements StateStore {
  get isPost(): boolean {
    return core.getState(KEY.IS_POST) == "true"
  }
  
  set isPost(isPost: boolean) {
    core.saveState(KEY.IS_POST, isPost)
  }
  
  get provisioningProfilePath(): string | null {
    return core.getState(KEY.PROVISIONING_PROFILE_PATH)
  }
  
  set(provisioningProfilePath: string) {
    core.saveState(KEY.PROVISIONING_PROFILE_PATH, provisioningProfilePath)
  }
}
