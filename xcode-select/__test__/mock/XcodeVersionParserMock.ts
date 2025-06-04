import XcodeVersion from "../../src/XcodeVersion/XcodeVersion"
import XcodeVersionParser from "../../src/XcodeVersion/XcodeVersionParser"

export default class XcodeVersionParserMock implements XcodeVersionParser {
  latestFilePath: string | null = null
  
  private result: XcodeVersion | null
  
  constructor(result: XcodeVersion | null = null) {
    this.result = result
  }
  
  parseFilePath(filePath: string): XcodeVersion | null {
    this.latestFilePath = filePath
    return this.result
  }
}
