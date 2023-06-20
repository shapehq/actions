import { StateStore } from "./StateStore";
export interface KeyValueStateWriterReader {
    getState(name: string): string | null;
    saveState(name: string, value: any | null): void;
}
export declare class KeyValueStateStore implements StateStore {
    private writerReader;
    constructor(writerReader: KeyValueStateWriterReader);
    get isPost(): boolean;
    set isPost(isPost: boolean);
}
