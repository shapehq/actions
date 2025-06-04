import XcodeVersion from "./XcodeVersion"

export default interface XcodeVersionParser {
  parseFilePath(filePath: string): XcodeVersion | null
}
