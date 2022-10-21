import { Logger } from "../../src/Logger"

export function makeMockLogger(): Logger {
  const destination = {
    info: (message: string) => {}
  }
  return new Logger(destination)
}
