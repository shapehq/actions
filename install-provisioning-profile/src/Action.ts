import { StateStore } from "./state/StateStore"
import { ProfileInstaller } from "./ProfileInstaller"
import { ProfileUninstaller } from "./ProfileUninstaller"

export interface ActionOptions {
  profileBase64: string
  filename: string | null
}

export class Action {
  stateStore: StateStore
  profileInstaller: ProfileInstaller
  profileUninstaller: ProfileUninstaller
  
  constructor(stateStore: StateStore, 
              profileInstaller: ProfileInstaller, 
              profileUninstaller: ProfileUninstaller) {
    this.stateStore = stateStore
    this.profileInstaller = profileInstaller
    this.profileUninstaller = profileUninstaller
  }

  run(options: ActionOptions) {
    if (!this.stateStore.isPost) {
      const provisioningProfilePath = this.profileInstaller.install(options.profileBase64, options.filename)
      this.stateStore.isPost = true
      this.stateStore.provisioningProfilePath = provisioningProfilePath
    } else {
      if (this.stateStore.provisioningProfilePath != null) {
        this.profileUninstaller.uninstall(this.stateStore.provisioningProfilePath)
      }
    }
  }
}
