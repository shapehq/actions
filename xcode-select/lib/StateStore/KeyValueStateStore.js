"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyValueStateStore = void 0;
const KEY = {
    IS_POST: "isPost"
};
class KeyValueStateStore {
    constructor(writerReader) {
        this.writerReader = writerReader;
        this.isPost = false;
    }
    get isPost() {
        return !!this.writerReader.getState(KEY.IS_POST);
    }
    set isPost(isPost) {
        this.writerReader.saveState(KEY.IS_POST, isPost);
    }
}
exports.KeyValueStateStore = KeyValueStateStore;
