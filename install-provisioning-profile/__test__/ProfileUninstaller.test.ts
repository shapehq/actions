import { PROVISIONING_PROFILES_DIR } from "../src/constants"
import { ProfileUninstaller } from "../src/ProfileUninstaller"
import { makeMockLogger } from "./mock/make-mock-logger"
import { Logger } from "../src/Logger"

test("Deletes input file", () => {
  let deletedFilePath: string | null = null
  const profileUninstaller = new ProfileUninstaller(
    (filePath) => {
      deletedFilePath = filePath
    },
    makeMockLogger()
  )
  const filePath = "profile.mobileprovision"
  profileUninstaller.uninstall(filePath)
  expect(deletedFilePath).toBe(filePath)
})

test("Logs a message that includes the file path", () => {
  let deletedFilePath: string | null = null
  let loggedMessage: string | null = null
  const profileUninstaller = new ProfileUninstaller(
    (filePath) => {
      deletedFilePath = filePath
    },
    new Logger({
      info: (message: string) => {
        loggedMessage = message
      }
    })
  )
  const filePath = "profile.mobileprovision"
  profileUninstaller.uninstall(filePath)
  expect(loggedMessage).toContain(deletedFilePath)
})