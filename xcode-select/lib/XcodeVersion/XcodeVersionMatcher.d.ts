import { SemanticVersion } from "../SemanticVersion/SemanticVersion";
import { XcodeVersion } from "./XcodeVersion";
import { XcodeVersionRepository } from "./XcodeVersionRepository";
export declare class XcodeVersionMatcher {
    private repository;
    constructor(repository: XcodeVersionRepository);
    findXcodeVersion(needle: SemanticVersion): XcodeVersion | null;
}
