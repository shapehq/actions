import IXcodeSelector from "../../src/XcodeSelector/IXcodeSelector"

export default class XcodeSelectorMock implements IXcodeSelector {
  public selectedFilePath: string | null = null
  
  async select(filePath: string): Promise<void> {
    this.selectedFilePath = filePath
  }
}
