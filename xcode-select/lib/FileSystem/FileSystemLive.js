"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemLive = void 0;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
class FileSystemLive {
    get homeDir() {
        return os_1.default.homedir();
    }
    listContentsOfDir(dirPath) {
        return fs_1.default.readdirSync(dirPath);
    }
}
exports.FileSystemLive = FileSystemLive;
