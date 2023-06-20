import { FileSystem } from "../FileSystem/FileSystem";
import { XcodeVersion } from "./XcodeVersion";
import { XcodeVersionParser } from "./XcodeVersionParser";
import { XcodeVersionRepository } from "./XcodeVersionRepository";
export declare class XcodeVersionRepositoryLive implements XcodeVersionRepository {
    private fileSystem;
    private xcodeVersionParser;
    constructor(fileSystem: FileSystem, xcodeVersionParser: XcodeVersionParser);
    getXcodeVersions(): XcodeVersion[];
}
