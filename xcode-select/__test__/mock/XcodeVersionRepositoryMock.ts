import {XcodeVersion} from "../../src/XcodeVersion/XcodeVersion"
import {XcodeVersionRepository} from "../../src/XcodeVersion/XcodeVersionRepository"

export class XcodeVersionRepositoryMock implements XcodeVersionRepository {
  private xcodeVersions: XcodeVersion[] = []
  
  getXcodeVersions(): XcodeVersion[] {
    return this.xcodeVersions
  }
  
  addXcodeVersion(major: number, minor: number | null = null, patch: number | null = null) {
    const name = "Xcode " + [major, minor, patch].filter(e => e != null).join(".")
    const filePath = "/Users/runner/Applications/" + name + ".app"
    const version = {major, minor, patch}
    this.xcodeVersions.push({name, filePath, version})
  }
}
