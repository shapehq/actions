import path from "path"
import FileSystem from "../FileSystem/FileSystem"
import XcodeVersion from "./XcodeVersion"
import XcodeVersionParser from "./XcodeVersionParser"
import XcodeVersionRepository from "./XcodeVersionRepository"
import { xcodeVersionSort } from "../XcodeVersion/XcodeVersion"

export default class XcodeVersionRepositoryLive implements XcodeVersionRepository {
  private fileSystem: FileSystem
  private xcodeVersionParser: XcodeVersionParser
  
  constructor(config: { fileSystem: FileSystem, xcodeVersionParser: XcodeVersionParser }) {
    this.fileSystem = config.fileSystem
    this.xcodeVersionParser = config.xcodeVersionParser
  }
  
  getXcodeVersions(): XcodeVersion[] {
    const dirPaths = [
      path.join("/", "Applications"),
      path.join(this.fileSystem.homeDir, "Applications")
    ]
    const xcodeVersions = dirPaths
      .reduce((result: string[], dirPath: string) => {
        return result.concat(this.fileSystem.listContentsOfDir(dirPath))
      }, [])
      .flatMap(filePath => {
        // Resolve symlinks.
        return this.fileSystem.realPath(filePath)
      })
      .flatMap(filePath => {
        const xcodeVersion = this.xcodeVersionParser.parseFilePath(filePath)
        if (xcodeVersion != null) {
          return xcodeVersion
        } else {
          return []
        }
      })
    // Ensure we have no duplicate Xcode versions.
    let result: XcodeVersion[] = []
    for (const xcodeVersion of xcodeVersions) {
      let existing = result.filter(e => {
        return e.version.major == xcodeVersion.version.major
          && e.version.minor === xcodeVersion.version.minor
          && e.version.patch === xcodeVersion.version.patch
          && e.isBeta === xcodeVersion.isBeta
          && e.betaNumber === xcodeVersion.betaNumber
      })
      if (existing.length == 0) {
        result.push(xcodeVersion)
      }
    }
    return result.sort(xcodeVersionSort)
  }
}
