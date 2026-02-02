import IStateStore from "./StateStore/IStateStore.js"
import ILogger from "./Logger/ILogger.js"
import SemanticVersionTemplateParser from "./SemanticVersion/SemanticVersionTemplateParser.js"
import IXcodeVersionRepository from "./XcodeVersion/IXcodeVersionRepository.js"
import XcodeVersionMatcher from "./XcodeVersion/XcodeVersionMatcher.js"
import IXcodeSelector from "./XcodeSelector/IXcodeSelector.js"

export interface ActionOptions {
  readonly version: string
}

export default class Action {
  private readonly stateStore: IStateStore
  private readonly logger: ILogger
  private readonly semanticVersionTemplateParser: SemanticVersionTemplateParser
  private readonly xcodeVersionRepository: IXcodeVersionRepository
  private readonly xcodeVersionMatcher: XcodeVersionMatcher
  private readonly xcodeSelector: IXcodeSelector
  
  constructor(config: {
    stateStore: IStateStore,
    logger: ILogger,
    semanticVersionTemplateParser: SemanticVersionTemplateParser,
    xcodeVersionRepository: IXcodeVersionRepository,
    xcodeVersionMatcher: XcodeVersionMatcher,
    xcodeSelector: IXcodeSelector
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
      const xcodeVersion = await this.xcodeVersionMatcher.findXcodeVersion(versionTemplate)
      await this.xcodeSelector.select(xcodeVersion.filePath)
      this.logger.log(xcodeVersion.name + " was selected.")
    } catch (error) {
      const installedXcodeNames = (await this.xcodeVersionRepository.getXcodeVersions())
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
