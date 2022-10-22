import { Logger } from "../../src/Logger"

export class MockLogger implements Logger {
  info(message: string) {}
}
