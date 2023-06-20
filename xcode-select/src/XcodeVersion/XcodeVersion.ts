import {SemanticVersion} from "../SemanticVersion/SemanticVersion"

export interface XcodeVersion {
  name: string
  filePath: string
  version: SemanticVersion
}
