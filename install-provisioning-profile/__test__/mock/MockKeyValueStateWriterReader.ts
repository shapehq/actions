import { KeyValueStateWriterReader } from "../../src/KeyValueStateStore"

export class MockKeyValueStateWriterReader implements KeyValueStateWriterReader {
  __store: {}
  
  constructor() {
    this.__store = {}
  }
  
  saveState(name: string, value: any) {
    this.__store[name] = value
  }
  
  getState(name: string): any {
    return this.__store[name]
  }
}