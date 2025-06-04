import SemanticVersion from "../../src/SemanticVersion/SemanticVersion"
import XcodeVersion from "../../src/XcodeVersion/XcodeVersion"
import IXcodeVersionRepository from "../../src/XcodeVersion/IXcodeVersionRepository"

export default class MockXcodeVersionRepository implements IXcodeVersionRepository {
  private xcodeVersions: XcodeVersion[] = []
  
  getXcodeVersions(): XcodeVersion[] {
    return this.xcodeVersions
  }
  
  addXcodeVersion(major: number, minor: number = 0, patch: number = 0, isBeta: boolean = false) {
    const name = "Xcode " + [major, minor, patch].filter(e => e != null).join(".")
    const filePath = "/Users/runner/Applications/" + name + ".app"
    const version = new SemanticVersion(major, minor, patch)
    const xcodeVersion = new XcodeVersion(filePath, version, isBeta)
    this.xcodeVersions.push(xcodeVersion)
  }
}
