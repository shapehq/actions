import fs from "fs"
import findAppIconFiles from "./utils/find-appicon-files"
import renderBetaBadge from "./render-beta-badge"

export interface ActionOptions {
  readonly searchDir: string
  readonly style: string
  readonly curlColor?: string
}

export interface ActionLogger {
  setFailed(message: string): void
}

export default class Action {
  private readonly logger: ActionLogger
  
  constructor(config: { logger: ActionLogger }) {
    this.logger = config.logger
  }
  
  async run(options: ActionOptions) {
    if (!fs.existsSync(options.searchDir)) {
      this.logger.setFailed(`Search directory does not exist: ${options.searchDir}`)
      return
    }
    if (!fs.lstatSync(options.searchDir).isDirectory()) {
      this.logger.setFailed(`Search directory is not a directory: ${options.searchDir}`)
      return
    }
    const appIconFilePaths = await findAppIconFiles(options.searchDir)
    if (appIconFilePaths.length === 0) {
      this.logger.setFailed(`No app icon files were found in the search directory.`)
      return
    }
    if (options.style === "beta") {
      await renderBetaBadge(appIconFilePaths, options.curlColor)
    } else {
      this.logger.setFailed(`The style \"${options.style}\" was not recognized.`)
    }
  }
}