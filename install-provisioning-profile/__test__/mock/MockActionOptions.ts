import { ActionOptions, Action } from "../../src/Action"

export class MockActionOptions implements ActionOptions {
  public profileBase64: string
  public filename: string | null
  
  constructor(profileBase64: string, filename: string | null = null) {
    this.profileBase64 = profileBase64
    this.filename = filename
  }
}