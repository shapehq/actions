import { Storage, StateStore } from "../../src/StateStore"

export function makeMockStateStore(): StateStore {
  return new StateStore(new MockBackingStorage())
}

class MockBackingStorage implements Storage {
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