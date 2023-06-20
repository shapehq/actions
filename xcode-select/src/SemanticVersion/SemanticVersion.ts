export interface SemanticVersion {
  major: number
  minor: number | null
  patch: number | null
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
