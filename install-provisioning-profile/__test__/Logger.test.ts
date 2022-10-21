import { Logger } from "../src/Logger"

test("Logs to destination", () => {
  const message = "Hello world!"
  let receivedMessage: string | null = null
  const destination = {
    info: (message: string) => {
      receivedMessage = message
    }
  }
  const logger = new Logger(destination)
  logger.info(message)
  expect(receivedMessage).toBe(message)
})