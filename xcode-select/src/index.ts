import * as core from "@actions/core"
import getOptions from "./getOptions"
import Action from "./Action"
import LoggerLive from "./Logger/LoggerLive"
import KeyValueStateStore from "./StateStore/KeyValueStateStore"
import CommandRunnerLive from "./CommandRunner/CommandRunnerLive"
import FileSystemLive from "./FileSystem/FileSystemLive"
import SemanticVersionParser from "./SemanticVersion/SemanticVersionParser"
import SemanticVersionTemplateParserLive from "./SemanticVersion/SemanticVersionTemplateParserLive"
import XcodeVersionMatcher from "./XcodeVersion/XcodeVersionMatcher"
import XcodeVersionParserLive from "./XcodeVersion/XcodeVersionParserLive"
import XcodeVersionRepositoryLive from "./XcodeVersion/XcodeVersionRepositoryLive"
import XcodeSelectorLive from "./XcodeSelector/XcodeSelectorLive"

const logger = new LoggerLive()
const xcodeVersionRepository = new XcodeVersionRepositoryLive(
  new FileSystemLive(), 
  new XcodeVersionParserLive(new SemanticVersionParser())
)
const action = new Action(
  new KeyValueStateStore(core),
  logger,
  new SemanticVersionTemplateParserLive(),
  xcodeVersionRepository,
  new XcodeVersionMatcher(xcodeVersionRepository),
  new XcodeSelectorLive(new CommandRunnerLive())
)
action.run(getOptions()).catch(err => {
  logger.error(err.toString())
})
