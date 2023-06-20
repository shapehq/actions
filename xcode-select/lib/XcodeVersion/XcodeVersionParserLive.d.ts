import { SemanticVersionParser } from "../SemanticVersion/SemanticVersionParser";
import { XcodeVersion } from "./XcodeVersion";
import { XcodeVersionParser } from "./XcodeVersionParser";
export declare class XcodeVersionParserLive implements XcodeVersionParser {
    private semanticVersionParser;
    constructor(semanticVersionParser: SemanticVersionParser);
    parseFilePath(filePath: string): XcodeVersion | null;
}
