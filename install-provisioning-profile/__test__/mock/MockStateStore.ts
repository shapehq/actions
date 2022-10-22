import { StateStore } from "../../src/StateStore"

export class MockStateStore implements StateStore {
  public isPost = false
  public provisioningProfilePath: string | null = null
}
