import { ActionOptions } from "../../src/Action"

export default class MockActionOptions implements ActionOptions {
  version: string
  
  constructor(version: string) {
    this.version = version
  }
}