import { PROVISIONING_PROFILES_DIR } from "../src/constants"
import { ProfileUninstaller } from "../src/ProfileUninstaller"

test("Deletes input file", () => {
  const filePath = "profile.mobileprovision"
  let deletedFilePath: string | null = null
  const profileUninstaller = new ProfileUninstaller(
    (filePath) => {
      deletedFilePath = filePath
    }
  )
  profileUninstaller.uninstall(filePath)
  expect(deletedFilePath).toBe(filePath)
})

