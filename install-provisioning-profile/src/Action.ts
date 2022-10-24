import { StateStore } from "./StateStore"
import { ProvisioningProfileInstaller } from "./ProvisioningProfileInstaller"
import { ProvisioningProfileStore } from "./ProvisioningProfileStore"
import { Logger } from "./Logger"

export interface ActionOptions {
  profileBase64: string
  filename: string | null
}

export class Action {
  stateStore: StateStore
  provisioningProfileStore: ProvisioningProfileStore
  provisioningProfileInstaller: ProvisioningProfileInstaller
  logger: Logger | null
  
  constructor(stateStore: StateStore,
              provisioningProfileStore: ProvisioningProfileStore,
              provisioningProfileInstaller: ProvisioningProfileInstaller,
              logger: Logger | null = null) {
    this.stateStore = stateStore
    this.provisioningProfileStore = provisioningProfileStore
    this.provisioningProfileInstaller = provisioningProfileInstaller
    this.logger = logger
  }

  run(options: ActionOptions) {
    const filename = options.filename
    const profileBase64 = options.profileBase64
    if (profileBase64 == undefined || profileBase64 == null || profileBase64.length == 0) {
      return
    }
    if (!this.stateStore.isPost) {
      const provisioningProfilePath = this.provisioningProfileInstaller.install(filename, profileBase64)
      this.stateStore.isPost = true
      this.stateStore.provisioningProfilePath = provisioningProfilePath
    } else {
      if (this.stateStore.provisioningProfilePath != null) {
        this.provisioningProfileStore.remove(this.stateStore.provisioningProfilePath)
      }
    }
  }
}
