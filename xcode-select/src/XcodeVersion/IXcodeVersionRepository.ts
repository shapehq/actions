import XcodeVersion from "./XcodeVersion"

export default interface IXcodeVersionRepository {
  getXcodeVersions(): XcodeVersion[]
}
