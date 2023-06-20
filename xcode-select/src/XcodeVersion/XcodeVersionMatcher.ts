import {SemanticVersion, semanticVersionSort} from "../SemanticVersion/SemanticVersion"
import {XcodeVersion} from "./XcodeVersion"
import {XcodeVersionRepository} from "./XcodeVersionRepository"

export class XcodeVersionMatcher {
  private repository: XcodeVersionRepository
  
  constructor(repository: XcodeVersionRepository) {
    this.repository = repository
  }
  
  findXcodeVersion(needle: SemanticVersion): XcodeVersion | null {
    const xcodeVersions = this.repository
      .getXcodeVersions()
      .sort((lhs, rhs) => {
        return semanticVersionSort(lhs.version, rhs.version)
      })
      .reverse()
    // Find candidate matching the major component.
    let candidates = xcodeVersions.filter(e => e.version.major == needle.major)
    if (candidates.length == 0) {
      return null
    }
    if (needle.minor == null) {
      return candidates[0]
    }
    // Find candidate matching the minor component.
    candidates = xcodeVersions.filter(e => e.version.minor == needle.minor)
    if (candidates.length == 0) {
      return null
    }
    if (needle.patch == null) {
      return candidates[0]
    }
    // Find candidate matching the patch component.
    candidates = xcodeVersions.filter(e => e.version.patch == needle.patch)
    if (candidates.length == 0) {
      return null
    }
    return candidates[0]
  }
}
