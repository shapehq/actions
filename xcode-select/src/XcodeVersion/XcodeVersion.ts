import {SemanticVersion} from "../SemanticVersion/SemanticVersion"

export class XcodeVersion {
  private _filePath: string
  private _version: SemanticVersion
  private _isBeta: boolean
  
  constructor(filePath: string, version: SemanticVersion, isBeta: boolean) {
    this._filePath = filePath
    this._version = version
    this._isBeta = isBeta
  }
  
  get filePath(): string {
    return this._filePath
  }
  
  get version(): SemanticVersion {
    return this._version
  }
  
  get isBeta(): boolean {
    return this._isBeta
  }
  
  get name(): string {
    let str = "Xcode " + this.version.displayString
    if (this.isBeta) {
      str += " Beta"
    }
    return str
  }
}
