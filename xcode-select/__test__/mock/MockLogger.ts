import ILogger from "../../src/Logger/ILogger"

export default class MockLogger implements ILogger {
  private _latestLogMessage: string | null = null
  
  get latestLogMessage(): string | null {
    return this._latestLogMessage
  }
  
  log(message: string) {
    this._latestLogMessage = message
  }
  
  error(_message: string) {}
}
