import {Logger} from "../../src/Logger/Logger"

export class LoggerMock implements Logger {
  private _latestLogMessage: string | null = null
  
  get latestLogMessage(): string | null {
    return this._latestLogMessage
  }
  
  log(message: string) {
    this._latestLogMessage = message
  }
  
  error(_message: string) {}
}
