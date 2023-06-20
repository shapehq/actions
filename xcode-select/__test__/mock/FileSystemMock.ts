import {FileSystem} from "../../src/FileSystem/FileSystem"

export class FileSystemMock implements FileSystem {
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
}