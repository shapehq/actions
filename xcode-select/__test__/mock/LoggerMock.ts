import {Logger} from "../../src/Logger/Logger"

export class LoggerMock implements Logger {
  log(_message: string) {}
  
  error(_message: string) {}
}
