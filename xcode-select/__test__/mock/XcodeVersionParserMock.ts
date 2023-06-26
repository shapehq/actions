import {XcodeVersion} from "../../src/XcodeVersion/XcodeVersion"
import {XcodeVersionParser} from "../../src/XcodeVersion/XcodeVersionParser"

export class XcodeVersionParserMock implements XcodeVersionParser {
  result: XcodeVersion | null = null
  latestFilePath: string | null = null
  
  parseFilePath(filePath: string): XcodeVersion | null {
    this.latestFilePath = filePath
    return null
  }
}
