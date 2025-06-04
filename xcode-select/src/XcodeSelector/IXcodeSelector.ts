export default interface IXcodeSelector {
  select(filePath: string): Promise<void>
}
