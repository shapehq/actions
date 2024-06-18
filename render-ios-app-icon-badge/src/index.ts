import { Command } from "commander"
import path from "path"
import fs from "fs"
import findAppIconFiles from "./utils/find-appicon-files"
import renderBetaBadge from "./render-beta-badge"

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
  .option("--primary-background-color <hex>", "the primary background color", "#b6d1eb")
  .option("--secondary-background-color <hex>", "the secondary background color. Used for the grid lines when adding the beta badge", "#6baae3")
  .option("--curl-color [hex]", "hex color for the curl. Only used by the \"beta\" style badge")
  .action(async (searchDir: string, options: {
    style: string,
    primaryBackgroundColor: string,
    secondaryBackgroundColor: string,
    curlColor?: string
  }) => {
    const absolutePath = path.resolve(searchDir)
    if (!fs.existsSync(absolutePath)) {
      console.error(`The directory ${absolutePath} does not exist.`)
      process.exit(1)
    }
    if (!fs.lstatSync(searchDir).isDirectory()) {
      console.error(`The path ${absolutePath} is not a directory.`)
      process.exit(1)
    }
    const appIconFilePaths = await findAppIconFiles(searchDir)
    if (appIconFilePaths.length === 0) {
      console.error(`No app icon files were found in the search directory.`)
      return
    }
    const style = options.style || "beta"
    if (style === "beta") {
      await renderBetaBadge({
        filePaths: appIconFilePaths,
        primaryBackgroundColor: options.primaryBackgroundColor,
        secondaryBackgroundColor: options.secondaryBackgroundColor,
        curlColor: options.curlColor
      })
    } else {
      console.error('Invalid style. Only "beta" is supported.')
      process.exit(1)
    }
  })

program.parse(process.argv)
