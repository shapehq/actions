export default interface IFileSystem {
  readonly homeDir: string
  listContentsOfDir(dirPath: string): string[]
  realPath(path: string): string
}
