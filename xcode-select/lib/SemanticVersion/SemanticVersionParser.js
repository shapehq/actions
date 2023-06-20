"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticVersionParser = void 0;
class SemanticVersionParser {
    parse(version) {
        const components = version
            // Separate major, minor, and patch.
            .split(".")
            // Ensure we don't have an empty component in case there are no numbers.
            .filter(s => s.length > 0);
        if (components.length < 1 || components.length > 3) {
            // We only understand version numbers with one, two or three components.
            return null;
        }
        let major = parseInt(components[0]);
        if (isNaN(major)) {
            return null;
        }
        let minor = null;
        let patch = null;
        if (components.length >= 2) {
            minor = parseInt(components[1]);
            if (isNaN(minor)) {
                return null;
            }
        }
        if (components.length >= 3) {
            patch = parseInt(components[2]);
            if (isNaN(patch)) {
                return null;
            }
        }
        return { major, minor, patch };
    }
}
exports.SemanticVersionParser = SemanticVersionParser;
