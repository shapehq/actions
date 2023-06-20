export interface SemanticVersion {
    major: number;
    minor: number | null;
    patch: number | null;
}
export declare function semanticVersionSort(lhs: SemanticVersion, rhs: SemanticVersion): 0 | 1 | -1;
