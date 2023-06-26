import path from "path"
import {FileSystem} from "../FileSystem/FileSystem"
import {XcodeVersion} from "./XcodeVersion"
import {XcodeVersionParser} from "./XcodeVersionParser"
import {XcodeVersionRepository} from "./XcodeVersionRepository"

export class XcodeVersionRepositoryLive implements XcodeVersionRepository {
  private fileSystem: FileSystem
  private xcodeVersionParser: XcodeVersionParser
  
  constructor(fileSystem: FileSystem, xcodeVersionParser: XcodeVersionParser) {
    this.fileSystem = fileSystem
    this.xcodeVersionParser = xcodeVersionParser
  }
  
  getXcodeVersions(): XcodeVersion[] {
    const dirPaths = [
      path.join("/", "Applications"),
      path.join(this.fileSystem.homeDir, "Applications")
    ]
    return dirPaths
      .reduce((result: string[], dirPath: string) => {
        return result.concat(this.fileSystem.listContentsOfDir(dirPath))
      }, [])
      .flatMap(filePath => {
        const xcodeVersion = this.xcodeVersionParser.parseFilePath(filePath)
        if (xcodeVersion != null) {
          return xcodeVersion
        } else {
          return []
        }
      })
  }
}
