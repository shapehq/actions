"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
    constructor(stateStore, semanticVersionParser, xcodeVersionRepository, xcodeVersionMatcher, xcodeSelector) {
        this.stateStore = stateStore;
        this.semanticVersionParser = semanticVersionParser;
        this.xcodeVersionRepository = xcodeVersionRepository;
        this.xcodeVersionMatcher = xcodeVersionMatcher;
        this.xcodeSelector = xcodeSelector;
    }
    run(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.stateStore.isPost) {
                yield this.runMain(options);
                this.stateStore.isPost = true;
            }
        });
    }
    runMain(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.version == null || options.version.length == 0) {
                throw new Error("No version supplied.");
            }
            const needleVersion = this.semanticVersionParser.parse(options.version);
            if (needleVersion == null) {
                throw new Error(options.version + " could not be parsed to a semantic version.");
            }
            const matchingXcodeVersion = this.xcodeVersionMatcher.findXcodeVersion(needleVersion);
            if (matchingXcodeVersion == null) {
                const installedXcodeNames = this.xcodeVersionRepository
                    .getXcodeVersions()
                    .map(e => "- " + e.name)
                    .join("\n");
                throw new Error("Xcode " + options.version + " was not found. "
                    + "The following versions of Xcode are available:\n\n"
                    + installedXcodeNames);
            }
            yield this.xcodeSelector.select(matchingXcodeVersion.filePath);
        });
    }
}
exports.Action = Action;
