import {SemanticVersion} from "../SemanticVersion/SemanticVersion"
import {semanticVersionSort} from "../SemanticVersion/SemanticVersion"

export class XcodeVersion {
  private _filePath: string
  private _version: SemanticVersion
  private _isBeta: boolean
  private _betaNumber: number | null
  
  constructor(
    filePath: string, 
    version: SemanticVersion, 
    isBeta: boolean = false, 
    betaNumber: number | null = null
  ) {
    this._filePath = filePath
    this._version = version
    this._isBeta = isBeta
    this._betaNumber = betaNumber
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
  
  get betaNumber(): number | null {
    return this._betaNumber
  }
  
  get name(): string {
    let str = "Xcode " + this.version.displayString
    if (this.isBeta) {
      str += " Beta"
      if (this.betaNumber != null) {
        str += " " + this.betaNumber
      }
    }
    return str
  }
}

export function xcodeVersionSort(lhs: XcodeVersion, rhs: XcodeVersion): number {
  const sort = semanticVersionSort(lhs.version, rhs.version)
  if (sort !== 0) {
    return sort
  }
  if (lhs.isBeta && !rhs.isBeta) {
    return -1
  } else if (!lhs.isBeta && rhs.isBeta) {
    return 1
  } else if (lhs.isBeta && rhs.isBeta && lhs.betaNumber != null && rhs.betaNumber != null) {
    if (lhs.betaNumber < rhs.betaNumber) {
      return -1
    } else if (lhs.betaNumber > rhs.betaNumber) {
      return 1
    } else {
      return 0
    }
  } else {
    return 0
  }
}
