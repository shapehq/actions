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
const xcodeVersionRepository = new XcodeVersionRepositoryLive({
  fileSystem: new FileSystemLive(), 
  xcodeVersionParser: new XcodeVersionParserLive({
    semanticVersionParser: new SemanticVersionParser()
  })
})
const action = new Action({
  stateStore: new KeyValueStateStore({ writerReader: core }),
  logger: logger,
  semanticVersionTemplateParser: new SemanticVersionTemplateParserLive(),
  xcodeVersionRepository: xcodeVersionRepository,
  xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository }),
  xcodeSelector: new XcodeSelectorLive({
    commandRunner: new CommandRunnerLive()
  })
})
action.run(getOptions()).catch(err => {
  logger.error(err.toString())
})
