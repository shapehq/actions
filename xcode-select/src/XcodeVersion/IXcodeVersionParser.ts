import XcodeVersion from "./XcodeVersion.js"

export default interface IXcodeVersionParser {
  parseFilePath(filePath: string): XcodeVersion | null
}
