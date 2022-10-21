import { StateStore } from "../../src/state/StateStore"

export class MockStateStore implements StateStore {
  __isPost: boolean
  __provisioningProfilePath: string | null
  
  constructor() {
    this.__isPost = false
    this.__provisioningProfilePath = null
  }
  
  get isPost(): boolean {
    return this.__isPost
  }
  
  set isPost(isPost: boolean) {
    this.__isPost = isPost
  }
  
  get provisioningProfilePath(): string | null {
    return this.__provisioningProfilePath
  }
  
  set provisioningProfilePath(provisioningProfilePath: string | null) {
    this.__provisioningProfilePath = provisioningProfilePath
  }
}