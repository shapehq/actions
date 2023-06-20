import * as core from "@actions/core"
import {Action} from "./Action"
import {StateStore} from "./StateStore/StateStore"
import {Logger} from "./Logger/Logger"
import {LoggerLive} from "./Logger/LoggerLive"
import {KeyValueStateStore} from "./StateStore/KeyValueStateStore"
import {CommandRunner} from "./CommandRunner/CommandRunner"
import {CommandRunnerLive} from "./CommandRunner/CommandRunnerLive"
import {FileSystem} from "./FileSystem/FileSystem"
import {FileSystemLive} from "./FileSystem/FileSystemLive"
import {SemanticVersionParser} from "./SemanticVersion/SemanticVersionParser"
import {XcodeVersionMatcher} from "./XcodeVersion/XcodeVersionMatcher"
import {XcodeVersionParser} from "./XcodeVersion/XcodeVersionParser"
import {XcodeVersionParserLive} from "./XcodeVersion/XcodeVersionParserLive"
import {XcodeVersionRepository} from "./XcodeVersion/XcodeVersionRepository"
import {XcodeVersionRepositoryLive} from "./XcodeVersion/XcodeVersionRepositoryLive"
import {XcodeSelector} from "./XcodeSelector/XcodeSelector"
import {XcodeSelectorLive} from "./XcodeSelector/XcodeSelectorLive"

export class CompositionRoot {
  static getAction(): Action {
    return new Action(
      this.getStateStore(),
      this.getLogger(),
      this.getSemanticVersionParser(),
      this.getXcodeRepository(),
      this.getXcodeVersionMatcher(),
      this.getXcodeSelector()
    )
  }
  
  static getLogger(): Logger {
    return new LoggerLive()
  }
  
  private static getStateStore(): StateStore {
    return new KeyValueStateStore(core)
  }
  
  private static getSemanticVersionParser(): SemanticVersionParser {
    return new SemanticVersionParser()
  }
  
  private static getXcodeVersionMatcher(): XcodeVersionMatcher {
    return new XcodeVersionMatcher(this.getXcodeRepository())
  }
  
  private static getXcodeRepository(): XcodeVersionRepository {
    return new XcodeVersionRepositoryLive(
      this.getFileSystem(), 
      this.getXcodeVersionParser()
    )
  }
  
  private static getXcodeVersionParser(): XcodeVersionParser {
    return new XcodeVersionParserLive(this.getSemanticVersionParser())
  }
  
  private static getXcodeSelector(): XcodeSelector {
    return new XcodeSelectorLive(this.getCommandRunner())
  }
  
  private static getCommandRunner(): CommandRunner {
    return new CommandRunnerLive()
  }
  
  private static getFileSystem(): FileSystem {
    return new FileSystemLive()
  }
}
