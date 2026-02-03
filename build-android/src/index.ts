import * as core from '@actions/core'
import { Config, Result } from './types.js'
import { processConfig, executeGradleBuild, discoverArtifacts, exportResult } from './services/index.js'

async function run(): Promise<void> {
  try {
    const startTime = new Date()
    const config: Config = await processConfig()
    await executeGradleBuild(config)
    const { appFiles } = await discoverArtifacts(config, startTime)
    const result: Result = {
      appFiles
    }
    await exportResult(result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    core.setFailed(errorMessage)
  }
}

run()
