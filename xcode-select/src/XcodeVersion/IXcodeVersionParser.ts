import XcodeVersion from "./XcodeVersion"

export default interface IXcodeVersionParser {
  parseFilePath(filePath: string): XcodeVersion | null
}
