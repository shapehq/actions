export class SemanticVersion {
  private _major: number
  private _minor: number | null
  private _patch: number | null
  
  constructor(major: number, minor: number | null, patch: number | null) {
    this._major = major
    this._minor = minor
    this._patch = patch
  }
  
  get major(): number {
    return this._major
  }
  
  get minor(): number | null {
    return this._minor
  }
  
  get patch(): number | null {
    return this._patch
  }
  
  get displayString(): string {
    return this.major + "." + (this.minor || 0) + "." + (this.patch || 0)
  }
}

export function semanticVersionSort(lhs: SemanticVersion, rhs: SemanticVersion) {
  let lhsMinor = lhs.minor || 0
  let rhsMinor = rhs.minor || 0
  let lhsPatch = lhs.patch || 0
  let rhsPatch = rhs.patch || 0
  if (lhs.major < rhs.major) {
    return -1
  } else if (lhs.major > rhs.major) {
    return 1
  } else if (lhsMinor < rhsMinor) {
    return -1
  } else if (lhsMinor > rhsMinor) {
    return 1
  } else if (lhsPatch < rhsPatch) {
    return -1
  } else if (lhsPatch > rhsPatch) {
    return 1
  } else {
    return 0
  }
}
