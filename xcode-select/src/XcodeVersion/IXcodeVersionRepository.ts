import XcodeVersion from "./XcodeVersion.js"

export default interface IXcodeVersionRepository {
  getXcodeVersions(): Promise<XcodeVersion[]>
}
