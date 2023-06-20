import {XcodeVersion} from "./XcodeVersion"

export interface XcodeVersionRepository {
  getXcodeVersions(): XcodeVersion[]
}
