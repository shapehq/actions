export default interface FileSystem {
  readonly homeDir: string
  listContentsOfDir(dirPath: string): string[]
  realPath(path: string): string
}
