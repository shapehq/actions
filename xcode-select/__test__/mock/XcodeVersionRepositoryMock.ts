import {SemanticVersion} from "../../src/SemanticVersion/SemanticVersion"
import {XcodeVersion} from "../../src/XcodeVersion/XcodeVersion"
import {XcodeVersionRepository} from "../../src/XcodeVersion/XcodeVersionRepository"

export class XcodeVersionRepositoryMock implements XcodeVersionRepository {
  private xcodeVersions: XcodeVersion[] = []
  
  getXcodeVersions(): XcodeVersion[] {
    return this.xcodeVersions
  }
  
  addXcodeVersion(major: number, minor: number | null = null, patch: number | null = null, isBeta: boolean = false) {
    const name = "Xcode " + [major, minor, patch].filter(e => e != null).join(".")
    const filePath = "/Users/runner/Applications/" + name + ".app"
    const version = new SemanticVersion(major, minor, patch)
    const xcodeVersion = new XcodeVersion(filePath, version, isBeta)
    this.xcodeVersions.push(xcodeVersion)
  }
}
