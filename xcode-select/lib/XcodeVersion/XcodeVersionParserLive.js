"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XcodeVersionParserLive = void 0;
class XcodeVersionParserLive {
    constructor(semanticVersionParser) {
        this.semanticVersionParser = semanticVersionParser;
    }
    parseFilePath(filePath) {
        const pathComponents = filePath.split("/");
        const filename = pathComponents[pathComponents.length - 1];
        if (!filename.toLowerCase().startsWith("xcode")) {
            return null;
        }
        const name = filename
            // Replace underscores and dashes with spaces.
            .replace(/_/, " ").replace(/-/, " ")
            // Remove ".app" suffix
            .replace(/\.app/, "");
        const rawVersion = name
            // Remove anything before the version number.
            .replace(/^[^0-9]+/, "")
            // Remove anything after the version number.
            .replace(/[^0-9]+$/, "");
        const version = this.semanticVersionParser.parse(rawVersion);
        if (version == null) {
            return null;
        }
        return { name, filePath, version };
    }
}
exports.XcodeVersionParserLive = XcodeVersionParserLive;
