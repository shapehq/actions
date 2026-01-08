import * as core from "@actions/core"
import getOptions from "./getOptions"
import Action from "./Action"
import ActionsLogger from "./Logger/ActionsLogger"
import KeyValueStateStore from "./StateStore/KeyValueStateStore"
import ExecCommandRunner from "./CommandRunner/ExecCommandRunner"
import FileSystem from "./FileSystem/FileSystem"
import PlistBuddyReader from "./PlistReader/PlistBuddyReader"
import SemanticVersionParser from "./SemanticVersion/SemanticVersionParser"
import SemanticVersionTemplateParser from "./SemanticVersion/SemanticVersionTemplateParser"
import XcodeVersionMatcher from "./XcodeVersion/XcodeVersionMatcher"
import XcodeVersionParser from "./XcodeVersion/XcodeVersionParser"
import FileSystemXcodeVersionRepository from "./XcodeVersion/FileSystemXcodeVersionRepository"
import CLIXcodeSelector from "./XcodeSelector/CLIXcodeSelector"

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
