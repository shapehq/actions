import { ActionOptions } from "../../src/Action"

export default class ActionOptionsMock implements ActionOptions {
  version: string
  
  constructor(version: string) {
    this.version = version
  }
}