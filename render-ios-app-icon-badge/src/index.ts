import { Command } from "commander"
import path from "path"
import fs from "fs"
import findAppIconFiles from "./utils/find-appicon-files"
import renderBetaBadge from "./render-beta-badge"
import renderIconBetaBadge from "./render-icon-beta-badge"

const program = new Command()

program
  .name("render-ios-app-icon-badge")
  .description("CLI to render iOS app icon badges")
  .version("1.0.0")

program
  .command("render")
  .description("Render the iOS app icon badge")
  .argument("<search-dir>", "path to the directory")
  .option("--style <style>", "style of the badge", "beta")
  .option("--curl-color [hex]", "hex color for the curl. Only used by the \"beta\" style badge")
  .action(async (searchDir: string, options: { style: string, curlColor?: string }) => {
    const absolutePath = path.resolve(searchDir)
    if (!fs.existsSync(absolutePath)) {
      console.error(`The directory ${absolutePath} does not exist.`)
      process.exit(1)
    }
    if (!fs.lstatSync(searchDir).isDirectory()) {
      console.error(`The path ${absolutePath} is not a directory.`)
      process.exit(1)
    }
    const appIconFiles = await findAppIconFiles(searchDir)

    if (appIconFiles.iconFiles.length === 0 && appIconFiles.imageFiles.length === 0) {
      console.error(`No app icon files were found in the search directory.`)
      return
    }

    const style = options.style || "beta"
    if (style === "beta") {
      if (appIconFiles.iconFiles.length > 0) {
        console.log(`Found ${appIconFiles.iconFiles.length} .icon file(s)`)
        await renderIconBetaBadge({
          iconPaths: appIconFiles.iconFiles,
          curlColor: options.curlColor
        })
      }

      if (appIconFiles.imageFiles.length > 0) {
        console.log(`Found ${appIconFiles.imageFiles.length} image app icon file(s)`)
        await renderBetaBadge({
          filePaths: appIconFiles.imageFiles,
          curlColor: options.curlColor
        })
      }
    } else {
      console.error('Invalid style. Only "beta" is supported.')
      process.exit(1)
    }
  })

program.parse(process.argv)
