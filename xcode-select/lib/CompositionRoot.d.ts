import { Action } from "./Action";
export declare class CompositionRoot {
    static getAction(): Action;
    private static getStateStore;
    private static getSemanticVersionParser;
    private static getXcodeVersionMatcher;
    private static getXcodeRepository;
    private static getXcodeVersionParser;
    private static getXcodeSelector;
    private static getCommandRunner;
    private static getFileSystem;
}
