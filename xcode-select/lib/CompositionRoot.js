"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositionRoot = void 0;
const core = __importStar(require("@actions/core"));
const Action_1 = require("./Action");
const KeyValueStateStore_1 = require("./StateStore/KeyValueStateStore");
const CommandRunnerLive_1 = require("./CommandRunner/CommandRunnerLive");
const FileSystemLive_1 = require("./FileSystem/FileSystemLive");
const SemanticVersionParser_1 = require("./SemanticVersion/SemanticVersionParser");
const XcodeVersionMatcher_1 = require("./XcodeVersion/XcodeVersionMatcher");
const XcodeVersionParserLive_1 = require("./XcodeVersion/XcodeVersionParserLive");
const XcodeVersionRepositoryLive_1 = require("./XcodeVersion/XcodeVersionRepositoryLive");
const XcodeSelectorLive_1 = require("./XcodeSelector/XcodeSelectorLive");
class CompositionRoot {
    static getAction() {
        return new Action_1.Action(this.getStateStore(), this.getSemanticVersionParser(), this.getXcodeRepository(), this.getXcodeVersionMatcher(), this.getXcodeSelector());
    }
    static getStateStore() {
        return new KeyValueStateStore_1.KeyValueStateStore(core);
    }
    static getSemanticVersionParser() {
        return new SemanticVersionParser_1.SemanticVersionParser();
    }
    static getXcodeVersionMatcher() {
        return new XcodeVersionMatcher_1.XcodeVersionMatcher(this.getXcodeRepository());
    }
    static getXcodeRepository() {
        return new XcodeVersionRepositoryLive_1.XcodeVersionRepositoryLive(this.getFileSystem(), this.getXcodeVersionParser());
    }
    static getXcodeVersionParser() {
        return new XcodeVersionParserLive_1.XcodeVersionParserLive(this.getSemanticVersionParser());
    }
    static getXcodeSelector() {
        return new XcodeSelectorLive_1.XcodeSelectorLive(this.getCommandRunner());
    }
    static getCommandRunner() {
        return new CommandRunnerLive_1.CommandRunnerLive();
    }
    static getFileSystem() {
        return new FileSystemLive_1.FileSystemLive();
    }
}
exports.CompositionRoot = CompositionRoot;
