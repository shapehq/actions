export interface XcodeSelector {
  select(filePath: string): Promise<void>
}
