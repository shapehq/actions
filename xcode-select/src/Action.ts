import StateStore from "./StateStore/StateStore"
import Logger from "./Logger/Logger"
import SemanticVersionTemplateParser from "./SemanticVersion/SemanticVersionTemplateParser"
import XcodeVersionRepository from "./XcodeVersion/XcodeVersionRepository"
import XcodeVersionMatcher from "./XcodeVersion/XcodeVersionMatcher"
import XcodeSelector from "./XcodeSelector/XcodeSelector"

export interface ActionOptions {
  readonly version: string
}

export default class Action {
  private readonly stateStore: StateStore
  private readonly logger: Logger
  private readonly semanticVersionTemplateParser: SemanticVersionTemplateParser
  private readonly xcodeVersionRepository: XcodeVersionRepository
  private readonly xcodeVersionMatcher: XcodeVersionMatcher
  private readonly xcodeSelector: XcodeSelector
  
  constructor(config: {
    stateStore: StateStore,
    logger: Logger,
    semanticVersionTemplateParser: SemanticVersionTemplateParser,
    xcodeVersionRepository: XcodeVersionRepository,
    xcodeVersionMatcher: XcodeVersionMatcher,
    xcodeSelector: XcodeSelector
  }) {
    this.stateStore = config.stateStore
    this.logger = config.logger
    this.semanticVersionTemplateParser = config.semanticVersionTemplateParser
    this.xcodeVersionRepository = config.xcodeVersionRepository
    this.xcodeVersionMatcher = config.xcodeVersionMatcher
    this.xcodeSelector = config.xcodeSelector
  }

  async run(options: ActionOptions) {
    if (!this.stateStore.isPost) {
      await this.runMain(options)
      this.stateStore.isPost = true
    }
  }
  
  private async runMain(options: ActionOptions) {
    if (options.version == null || options.version.length == 0) {
      throw new Error("No version supplied.")
    }
    const versionTemplate = this.semanticVersionTemplateParser.parse(options.version)
    if (versionTemplate == null) {
      throw new Error(options.version + " could not be parsed to a semantic version template.")
    }
    try {
      const xcodeVersion = this.xcodeVersionMatcher.findXcodeVersion(versionTemplate)
      await this.xcodeSelector.select(xcodeVersion.filePath)
      this.logger.log(xcodeVersion.name + " was selected.")
    } catch {
      const installedXcodeNames = this.xcodeVersionRepository
        .getXcodeVersions()
        .map(e => "- " + e.name)
        .join("\n")
      throw new Error(
        "Xcode " + options.version + " was not found.\n\n"
        + "The following versions of Xcode are available:\n"
        + installedXcodeNames
      )
    }
  }
}
