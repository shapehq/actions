import {StateStore} from "./StateStore/StateStore"
import {Logger} from "./Logger/Logger"
import {SemanticVersionParser} from "./SemanticVersion/SemanticVersionParser"
import {XcodeVersionRepository} from "./XcodeVersion/XcodeVersionRepository"
import {XcodeVersionMatcher} from "./XcodeVersion/XcodeVersionMatcher"
import {XcodeSelector} from "./XcodeSelector/XcodeSelector"

export interface ActionOptions {
  version: string
}

export class Action {
  private stateStore: StateStore
  private logger: Logger
  private semanticVersionParser: SemanticVersionParser
  private xcodeVersionRepository: XcodeVersionRepository
  private xcodeVersionMatcher: XcodeVersionMatcher
  private xcodeSelector: XcodeSelector
  
  constructor(
    stateStore: StateStore,
    logger: Logger,
    semanticVersionParser: SemanticVersionParser,
    xcodeVersionRepository: XcodeVersionRepository,
    xcodeVersionMatcher: XcodeVersionMatcher,
    xcodeSelector: XcodeSelector
  ) {
    this.stateStore = stateStore
    this.logger = logger
    this.semanticVersionParser = semanticVersionParser
    this.xcodeVersionRepository = xcodeVersionRepository
    this.xcodeVersionMatcher = xcodeVersionMatcher
    this.xcodeSelector = xcodeSelector
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
    const needleVersion = this.semanticVersionParser.parse(options.version)
    if (needleVersion == null) {
      throw new Error(options.version + " could not be parsed to a semantic version.")
    }
    const matchingXcodeVersion = this.xcodeVersionMatcher.findXcodeVersion(needleVersion)
    if (matchingXcodeVersion == null) {
      const installedXcodeNames = this.xcodeVersionRepository
        .getXcodeVersions()
        .map(e => "- " + e.name)
        .join("\n")
      throw new Error(
        "Xcode " + options.version + " was not found. "
        + "The following versions of Xcode are available:\n\n"
        + installedXcodeNames
      )
    }
    await this.xcodeSelector.select(matchingXcodeVersion.filePath)
    this.logger.log(matchingXcodeVersion.name + " was selected.")
  }
}
