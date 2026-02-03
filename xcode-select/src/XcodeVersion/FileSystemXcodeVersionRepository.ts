import path from "path"
import IFileSystem from "../FileSystem/IFileSystem.js"
import XcodeVersion from "./XcodeVersion.js"
import IXcodeVersionParser from "./IXcodeVersionParser.js"
import IXcodeVersionRepository from "./IXcodeVersionRepository.js"
import { xcodeVersionSort } from "../XcodeVersion/XcodeVersion.js"
import IPlistReader from "../PlistReader/IPlistReader.js"

export default class FileSystemXcodeVersionRepository implements IXcodeVersionRepository {
  private readonly fileSystem: IFileSystem
  private readonly xcodeVersionParser: IXcodeVersionParser
  private readonly plistReader: IPlistReader
  
  constructor(config: { fileSystem: IFileSystem, xcodeVersionParser: IXcodeVersionParser, plistReader: IPlistReader }) {
    this.fileSystem = config.fileSystem
    this.xcodeVersionParser = config.xcodeVersionParser
    this.plistReader = config.plistReader
  }
  
  async getXcodeVersions(): Promise<XcodeVersion[]> {
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
    const xcodeVersionsWithBuildNumbers = await Promise.all(
      xcodeVersions.map(async xcodeVersion => {
        const versionPlistPath = path.join(xcodeVersion.filePath, "Contents", "version.plist")
        const buildNumber = await this.plistReader.getValue(versionPlistPath, "ProductBuildVersion")
        return xcodeVersion.withBuildNumber(buildNumber)
      })
    )
    // Ensure we have no duplicate Xcode versions.
    let result: XcodeVersion[] = []
    for (const xcodeVersion of xcodeVersionsWithBuildNumbers) {
      let existing = result.filter(e => {
        return e.version.major == xcodeVersion.version.major
          && e.version.minor === xcodeVersion.version.minor
          && e.version.patch === xcodeVersion.version.patch
          && e.isBeta === xcodeVersion.isBeta
          && e.betaNumber === xcodeVersion.betaNumber
          && e.isReleaseCandidate === xcodeVersion.isReleaseCandidate
      })
      if (existing.length == 0) {
        result.push(xcodeVersion)
      }
    }
    return result.sort(xcodeVersionSort)
  }
}
