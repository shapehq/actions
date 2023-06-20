import { CommandRunner } from "./CommandRunner";
export declare class CommandRunnerLive implements CommandRunner {
    run(cmd: string): Promise<string>;
}
