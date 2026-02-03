import * as core from "@actions/core"
import getOptions from "./getOptions.js"
import Action from "./Action.js"
import ActionsLogger from "./Logger/ActionsLogger.js"
import KeyValueStateStore from "./StateStore/KeyValueStateStore.js"
import ExecCommandRunner from "./CommandRunner/ExecCommandRunner.js"
import FileSystem from "./FileSystem/FileSystem.js"
import PlistBuddyReader from "./PlistReader/PlistBuddyReader.js"
import SemanticVersionParser from "./SemanticVersion/SemanticVersionParser.js"
import SemanticVersionTemplateParser from "./SemanticVersion/SemanticVersionTemplateParser.js"
import XcodeVersionMatcher from "./XcodeVersion/XcodeVersionMatcher.js"
import XcodeVersionParser from "./XcodeVersion/XcodeVersionParser.js"
import FileSystemXcodeVersionRepository from "./XcodeVersion/FileSystemXcodeVersionRepository.js"
import CLIXcodeSelector from "./XcodeSelector/CLIXcodeSelector.js"

const logger = new ActionsLogger()
const commandRunner = new ExecCommandRunner()
const plistReader = new PlistBuddyReader({ commandRunner })
const xcodeVersionRepository = new FileSystemXcodeVersionRepository({
  fileSystem: new FileSystem(), 
  xcodeVersionParser: new XcodeVersionParser({
    semanticVersionParser: new SemanticVersionParser()
  }),
  plistReader
})
const action = new Action({
  stateStore: new KeyValueStateStore({ writerReader: core }),
  logger: logger,
  semanticVersionTemplateParser: new SemanticVersionTemplateParser(),
  xcodeVersionRepository: xcodeVersionRepository,
  xcodeVersionMatcher: new XcodeVersionMatcher({ xcodeVersionRepository }),
  xcodeSelector: new CLIXcodeSelector({
    commandRunner
  })
})
action.run(getOptions()).catch(err => {
  logger.error(err.toString())
})
