import IFileSystem from "../../src/FileSystem/IFileSystem"

export default class MockFileSystem implements IFileSystem {
  dirContents: string[] = []
  
  private _homeDir: string
  private _listedDirectories: string[] = []
  
  constructor(homeDir: string = "/Users/runner") {
    this._homeDir = homeDir
  }
  
  get homeDir(): string {
    return this._homeDir
  }
  
  get listedDirectories(): string[] {
    return this._listedDirectories
  }
  
  listContentsOfDir(dirPath: string): string[] {
    this._listedDirectories.push(dirPath)
    return this.dirContents
  }
  
  realPath(path: string): string {
    return path
  }
}