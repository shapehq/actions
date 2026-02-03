export default interface IPlistReader {
  getValue(filePath: string, key: string): Promise<string | null>
}
