"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticVersionSort = void 0;
function semanticVersionSort(lhs, rhs) {
    let lhsMinor = lhs.minor || 0;
    let rhsMinor = rhs.minor || 0;
    let lhsPatch = lhs.patch || 0;
    let rhsPatch = rhs.patch || 0;
    if (lhs.major < rhs.major) {
        return -1;
    }
    else if (lhs.major > rhs.major) {
        return 1;
    }
    else if (lhsMinor < rhsMinor) {
        return -1;
    }
    else if (lhsMinor > rhsMinor) {
        return 1;
    }
    else if (lhsPatch < rhsPatch) {
        return -1;
    }
    else if (lhsPatch > rhsPatch) {
        return 1;
    }
    else {
        return 0;
    }
}
exports.semanticVersionSort = semanticVersionSort;
