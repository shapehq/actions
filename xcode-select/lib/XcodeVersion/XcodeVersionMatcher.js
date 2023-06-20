"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XcodeVersionMatcher = void 0;
const SemanticVersion_1 = require("../SemanticVersion/SemanticVersion");
class XcodeVersionMatcher {
    constructor(repository) {
        this.repository = repository;
    }
    findXcodeVersion(needle) {
        const xcodeVersions = this.repository
            .getXcodeVersions()
            .sort((lhs, rhs) => {
            return (0, SemanticVersion_1.semanticVersionSort)(lhs.version, rhs.version);
        })
            .reverse();
        // Find candidate matching the major component.
        let candidates = xcodeVersions.filter(e => e.version.major == needle.major);
        if (candidates.length == 0) {
            return null;
        }
        if (needle.minor == null) {
            return candidates[0];
        }
        // Find candidate matching the minor component.
        candidates = xcodeVersions.filter(e => e.version.minor == needle.minor);
        if (candidates.length == 0) {
            return null;
        }
        if (needle.patch == null) {
            return candidates[0];
        }
        // Find candidate matching the patch component.
        candidates = xcodeVersions.filter(e => e.version.patch == needle.patch);
        if (candidates.length == 0) {
            return null;
        }
        return candidates[0];
    }
}
exports.XcodeVersionMatcher = XcodeVersionMatcher;
