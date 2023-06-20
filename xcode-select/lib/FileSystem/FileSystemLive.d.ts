import { FileSystem } from "./FileSystem";
export declare class FileSystemLive implements FileSystem {
    get homeDir(): string;
    listContentsOfDir(dirPath: string): string[];
}
