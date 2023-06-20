import { XcodeSelector } from "./XcodeSelector";
import { CommandRunner } from "../CommandRunner/CommandRunner";
export declare class XcodeSelectorLive implements XcodeSelector {
    private commandRunner;
    constructor(commandRunner: CommandRunner);
    select(filePath: string): Promise<void>;
}
