export class SemanticVersion {
  private _major: number
  private _minor: number
  private _patch: number
  
  constructor(major: number, minor: number, patch: number) {
    this._major = major
    this._minor = minor
    this._patch = patch
  }
  
  get major(): number {
    return this._major
  }
  
  get minor(): number {
    return this._minor
  }
  
  get patch(): number {
    return this._patch
  }
  
  get displayString(): string {
    return this.major + "." + this.minor + "." + this.patch
  }
}

export function semanticVersionSort(lhs: SemanticVersion, rhs: SemanticVersion) {
  if (lhs.major < rhs.major) {
    return -1
  } else if (lhs.major > rhs.major) {
    return 1
  } else if (lhs.minor < rhs.minor) {
    return -1
  } else if (lhs.minor > rhs.minor) {
    return 1
  } else if (lhs.patch < rhs.patch) {
    return -1
  } else if (lhs.patch > rhs.patch) {
    return 1
  } else {
    return 0
  }
}
