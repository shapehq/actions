import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as path from 'path'
import * as fs from 'fs'
import { Config, ManifestFile } from '../types.js'
import { generateManifestPathPatterns, getBaseName } from '../utils.js'

export async function discoverManifests(config: Config, started: Date): Promise<{ manifestFiles: ManifestFile[] }> {
  core.info('')
  core.info('Export Merged Manifests:')

  const manifestPathPatterns = generateManifestPathPatterns(config.module, config.variants)
  const projectRoot = path.resolve(config.projectLocation).replace(/\\/g, '/').replace(/\/+$/u, '')
  const scopedPatterns = manifestPathPatterns.map((pattern) => `${projectRoot}/${pattern.replace(/^\/+/u, '')}`)

  core.info('Generated search patterns:')
  scopedPatterns.forEach((pattern) => core.info(`  ${pattern}`))

  const manifestFiles = await getManifests(config.projectLocation, started, scopedPatterns)

  printManifestSearchInfo(manifestFiles, scopedPatterns)

  if (manifestFiles.length === 0) {
    core.warning(`No merged manifests found with generated patterns:\n${scopedPatterns.join('\n')}`)
    core.warning('The merged manifest location can vary across AGP versions; please verify your build outputs.')
  }

  return {
    manifestFiles
  }
}

async function getManifests(projectLocation: string, started: Date, patterns: string[]): Promise<ManifestFile[]> {
  const manifests: ManifestFile[] = []

  for (const pattern of patterns) {
    try {
      const files = await findManifests(projectLocation, started, pattern)
      manifests.push(...files)
    } catch (error) {
      core.warning(`Failed to find manifest with pattern ( ${pattern} ), error: ${error}`)
      continue
    }
  }

  if (manifests.length === 0) {
    if (started.getTime() > 0) {
      core.warning(`No merged manifests found with patterns: ${patterns.join(', ')} that has modification time after: ${started}`)
      core.warning('Retrying without modtime check....')
      core.info('')
      return getManifests(projectLocation, new Date(0), patterns)
    }
    core.warning(`No merged manifests found with pattern: ${patterns.join(', ')} without modtime check`)
  }

  return manifests
}

async function findManifests(projectLocation: string, generatedAfter: Date, pattern: string): Promise<ManifestFile[]> {
  const manifests: ManifestFile[] = []

  try {
    const globber = await glob.create(pattern, {
      followSymbolicLinks: false,
      implicitDescendants: true
    })

    const files = await globber.glob()

    for (const file of files) {
      try {
        const stats = await fs.promises.stat(file)

        if (generatedAfter && stats.mtime < generatedAfter) {
          continue
        }

        manifests.push({
          path: file,
          name: getBaseName(file)
        })
      } catch (error) {
        core.warning(`Failed to stat file ${file}: ${error}`)
      }
    }
  } catch (error) {
    throw new Error(`Failed to find manifests with pattern ${pattern}: ${error}`)
  }

  return manifests
}

function printManifestSearchInfo(manifestFiles: ManifestFile[], patterns: string[]): void {
  const manifestNames = manifestFiles.map((m) => m.name)

  core.info('Used patterns for merged manifest search:')
  core.info(patterns.join('\n'))
  core.info('')
  core.info('Found merged manifests:')
  core.info(manifestNames.join('\n'))
  core.info('')
}
