import {SemanticVersionParser} from "../SemanticVersion/SemanticVersionParser"
import {XcodeVersion} from "./XcodeVersion"
import {XcodeVersionParser} from "./XcodeVersionParser"

export class XcodeVersionParserLive implements XcodeVersionParser {
  private semanticVersionParser: SemanticVersionParser
  
  constructor(semanticVersionParser: SemanticVersionParser) {
    this.semanticVersionParser = semanticVersionParser
  }
  
  parseFilePath(filePath: string): XcodeVersion | null {
    const pathComponents = filePath.split("/")
    const filename = pathComponents[pathComponents.length - 1]
    if (!filename.toLowerCase().startsWith("xcode")) {
      return null
    }
    const name = filename
      // Replace underscores and dashes with spaces.
      .replace(/_/g, " ").replace(/-/g, " ")
      // Remove ".app" suffix
      .replace(/\.app/, "")
    const rawVersion = name
      // Remove anything before the version number.
      .replace(/^[^0-9]+/, "")
      // Remove anythign after beta.
      .replace(/beta.*$/i, "")
      // Remove anything after the version number.
      .replace(/[^0-9]+$/, "")
    // Check if it is a beta version.
    const isBeta = name.toLowerCase().includes("beta")
    // Extract the b eta number if available.
    let betaNumber: number | null = null
    if (isBeta) {
      const match = name.match(/beta(?:[-_\.]?)([0-9]+)$/i)
      if (match != null) {
        betaNumber = parseInt(match[1])
        if (isNaN(betaNumber)) {
          betaNumber = null
        }
      }
    }
    const version = this.semanticVersionParser.parse(rawVersion)
    if (version == null) {
      return null
    }
    return new XcodeVersion(filePath, version, isBeta, betaNumber)
  }
}
