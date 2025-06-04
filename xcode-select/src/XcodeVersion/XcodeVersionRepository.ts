import XcodeVersion from "./XcodeVersion"

export default interface XcodeVersionRepository {
  getXcodeVersions(): XcodeVersion[]
}
