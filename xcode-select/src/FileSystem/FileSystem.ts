export interface FileSystem {
  homeDir: string
  listContentsOfDir(dirPath: string): string[]
  realPath(path: string): string
}
