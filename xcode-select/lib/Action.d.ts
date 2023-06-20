import { StateStore } from "./StateStore/StateStore";
import { SemanticVersionParser } from "./SemanticVersion/SemanticVersionParser";
import { XcodeVersionRepository } from "./XcodeVersion/XcodeVersionRepository";
import { XcodeVersionMatcher } from "./XcodeVersion/XcodeVersionMatcher";
import { XcodeSelector } from "./XcodeSelector/XcodeSelector";
export interface ActionOptions {
    version: string;
}
export declare class Action {
    private stateStore;
    private semanticVersionParser;
    private xcodeVersionRepository;
    private xcodeVersionMatcher;
    private xcodeSelector;
    constructor(stateStore: StateStore, semanticVersionParser: SemanticVersionParser, xcodeVersionRepository: XcodeVersionRepository, xcodeVersionMatcher: XcodeVersionMatcher, xcodeSelector: XcodeSelector);
    run(options: ActionOptions): Promise<void>;
    private runMain;
}
