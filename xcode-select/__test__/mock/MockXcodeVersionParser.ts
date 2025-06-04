import XcodeVersion from "../../src/XcodeVersion/XcodeVersion"
import IXcodeVersionParser from "../../src/XcodeVersion/IXcodeVersionParser"

export default class XcodeVersionParserMock implements IXcodeVersionParser {
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
