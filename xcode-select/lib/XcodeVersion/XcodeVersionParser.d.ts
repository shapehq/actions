import { XcodeVersion } from "./XcodeVersion";
export interface XcodeVersionParser {
    parseFilePath(filePath: string): XcodeVersion | null;
}
