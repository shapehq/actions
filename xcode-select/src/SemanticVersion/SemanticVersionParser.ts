import SemanticVersion from "./SemanticVersion.js"

export default class SemanticVersionParser {
  parse(version: string): SemanticVersion | null {
    const components = version
      // Separate major, minor, and patch.
      .split(".")
      // Ensure we don't have an empty component in case there are no numbers.
      .filter(s => s.length > 0)
    if (components.length < 1 || components.length > 3) {
      // We only understand version numbers with one, two or three components.
      return null
    }
    let major = parseInt(components[0])
    if (isNaN(major)) {
      return null
    }
    let minor: number = 0
    let patch: number = 0
    if (components.length >= 2) {
      minor = parseInt(components[1])
      if (isNaN(minor)) {
        return null
      }
    }
    if (components.length >= 3) {
      patch = parseInt(components[2])
      if (isNaN(patch)) {
        return null
      }
    }
    return new SemanticVersion(major, minor, patch)
  }
}
