export default interface XcodeSelector {
  select(filePath: string): Promise<void>
}
