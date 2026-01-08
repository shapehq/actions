import SemanticVersionTemplate, { 
  SemanticVersionTemplatePlaceholder
} from "../SemanticVersion/SemanticVersionTemplate"
import { semanticVersionSort } from "../SemanticVersion/SemanticVersion"
import XcodeVersion from "./XcodeVersion"
import IXcodeVersionRepository from "./IXcodeVersionRepository"

export default class XcodeVersionMatcher {
  private readonly xcodeVersionRepository: IXcodeVersionRepository
  
  constructor(config: { xcodeVersionRepository: IXcodeVersionRepository }) {
    this.xcodeVersionRepository = config.xcodeVersionRepository
  }
  
  async findXcodeVersion(needle: SemanticVersionTemplate): Promise<XcodeVersion> {
    const xcodeVersions = (await this.xcodeVersionRepository.getXcodeVersions())
      .sort((lhs, rhs) => {
        const versionCompare = semanticVersionSort(lhs.version, rhs.version)
        if (versionCompare !== 0) {
          return versionCompare
        }
        // Prefer non-beta (release) over beta when versions are equal
        if (lhs.isBeta !== rhs.isBeta) {
          return lhs.isBeta ? -1 : 1
        }
        return 0
      })
      .reverse()
    // Find candidate matching the major component.
    let candidates = xcodeVersions.filter(e => e.version.major == needle.major)
    if (candidates.length == 0) {
      throw new Error("No version found matching " + needle.displayString)
    }
    if (needle.minor === SemanticVersionTemplatePlaceholder) {
      if (needle.patch === SemanticVersionTemplatePlaceholder) {
        return candidates[0]
      } else {
        throw new Error("Invalid version template: " + needle.displayString + ". Patch must either be a placeholder or absent when minor is a placeholder.")
      }
    }
    // Find candidate matching the minor component.
    candidates = candidates.filter(e => e.version.minor == needle.minor)
    if (candidates.length == 0) {
      throw new Error("No version found matching " + needle.displayString)
    }
    if (needle.patch === SemanticVersionTemplatePlaceholder) {
      return candidates[0]
    }
    // Find candidate matching the patch component.
    candidates = candidates.filter(e => e.version.patch == (needle.patch || 0))
    if (candidates.length == 0) {
      throw new Error("No version found matching " + needle.displayString)
    }
    return candidates[0]
  }
}
