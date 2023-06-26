import {XcodeSelector} from "../../src/XcodeSelector/XcodeSelector"

export class XcodeSelectorMock implements XcodeSelector {
  public selectedFilePath: string | null = null
  
  async select(filePath: string): Promise<void> {
    this.selectedFilePath = filePath
  }
}
