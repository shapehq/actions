import XcodeSelector from "../../src/XcodeSelector/XcodeSelector"

export default class XcodeSelectorMock implements XcodeSelector {
  public selectedFilePath: string | null = null
  
  async select(filePath: string): Promise<void> {
    this.selectedFilePath = filePath
  }
}
