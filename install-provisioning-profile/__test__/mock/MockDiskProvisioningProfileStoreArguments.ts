import { DiskProvisioningProfileStoreArguments } from "../../src/DiskProvisioningProfileStore"
import { MockLogger } from "./MockLogger"

export class MockDiskProvisioningProfileStoreArguments implements DiskProvisioningProfileStoreArguments {
  public dir = "~/Library/MobileDevice/Provisioning Profiles"
  public logger = new MockLogger()
  public fileExistanceChecker = (filePath: string) => {
    return false
  }
  public directoryCreator = (dir: string) => {}
  public fileWriter = (filePath: string, content: Buffer) => {}
  public fileRemover = (filePath: string) => {}
} 