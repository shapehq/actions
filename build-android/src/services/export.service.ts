import * as core from '@actions/core'
import * as path from 'path'
import { Result, ARTIFACT_ENV_KEY, ARTIFACT_LIST_ENV_KEY, MANIFEST_ENV_KEY, MANIFEST_LIST_ENV_KEY } from '../types.js'

export async function exportResult(result: Result): Promise<void> {
  if (result.appFiles.length === 0) {
    throw new Error('Could not find any app artifacts')
  }

  const lastArtifact = result.appFiles[result.appFiles.length - 1]
  core.setOutput(ARTIFACT_ENV_KEY, lastArtifact.path)
  core.info('')
  core.info(`  Output [ ${ARTIFACT_ENV_KEY} = ${path.basename(lastArtifact.path)} ]`)

  const artifactPaths = result.appFiles.map((artifact) => artifact.path).join('|')
  core.setOutput(ARTIFACT_LIST_ENV_KEY, artifactPaths)
  core.info(`  Output [ ${ARTIFACT_LIST_ENV_KEY} = ${result.appFiles.map((a) => path.basename(a.path)).join('|')} ]`)

  if (result.manifestFiles.length > 0) {
    const lastManifest = result.manifestFiles[result.manifestFiles.length - 1]
    core.setOutput(MANIFEST_ENV_KEY, lastManifest.path)
    core.info('')
    core.info(`  Output [ ${MANIFEST_ENV_KEY} = ${path.basename(lastManifest.path)} ]`)

    const manifestPaths = result.manifestFiles.map((manifest) => manifest.path).join('|')
    core.setOutput(MANIFEST_LIST_ENV_KEY, manifestPaths)
    core.info(`  Output [ ${MANIFEST_LIST_ENV_KEY} = ${result.manifestFiles.map((m) => path.basename(m.path)).join('|')} ]`)
  } else {
    core.warning('No merged manifest files found to export.')
  }

  // Log summary
  core.info('')
  core.info(`Total artifacts exported: ${result.appFiles.length}`)
  core.info(`Total merged manifests exported: ${result.manifestFiles.length}`)
}
