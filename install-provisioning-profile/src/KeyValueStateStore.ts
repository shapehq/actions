import {StateStore} from "./StateStore"

export interface KeyValueStateWriterReader {
  getState(name: string): string | null
  saveState(name: string, value: any | null)
}

const KEY = {
  IS_POST: "isPost",
  PROVISIONING_PROFILE_PATH: "provisioningProfilePath"
}

export class KeyValueStateStore implements StateStore {
  writerReader: KeyValueStateWriterReader
  
  constructor(writerReader: KeyValueStateWriterReader) {
    this.writerReader = writerReader
    this.isPost = false
  }
  
  get isPost(): boolean {
    return !!this.writerReader.getState(KEY.IS_POST)
  }
  
  set isPost(isPost: boolean) {
    this.writerReader.saveState(KEY.IS_POST, isPost)
  }
  
  get provisioningProfilePath(): string | null {
    const value = this.writerReader.getState(KEY.PROVISIONING_PROFILE_PATH)
    if (value !== undefined) {
      return value
    } else {
      return null
    }
  }
  
  set provisioningProfilePath(provisioningProfilePath: string | null) {
    this.writerReader.saveState(KEY.PROVISIONING_PROFILE_PATH, provisioningProfilePath)
  }
}
