"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XcodeVersionRepositoryLive = void 0;
const path_1 = __importDefault(require("path"));
class XcodeVersionRepositoryLive {
    constructor(fileSystem, xcodeVersionParser) {
        this.fileSystem = fileSystem;
        this.xcodeVersionParser = xcodeVersionParser;
    }
    getXcodeVersions() {
        const dirPaths = [
            path_1.default.join("/", "Applications"),
            path_1.default.join(this.fileSystem.homeDir, "Applications")
        ];
        return dirPaths
            .reduce((result, dirPath) => {
            return result.concat(this.fileSystem.listContentsOfDir(dirPath));
        }, [])
            .flatMap(filePath => {
            const xcodeVersion = this.xcodeVersionParser.parseFilePath(filePath);
            if (xcodeVersion != null) {
                return xcodeVersion;
            }
            else {
                return [];
            }
        });
    }
}
exports.XcodeVersionRepositoryLive = XcodeVersionRepositoryLive;
