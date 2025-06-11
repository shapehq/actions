import * as core from "@actions/core";
import * as glob from "@actions/glob";
import * as path from "path";
import * as fs from "fs";
import { Config, Artifact } from "../types";
import { generateAppPathPatterns, getFileExtension, getBaseName } from "../utils";

export async function discoverArtifacts(config: Config, started: Date): Promise<{ appFiles: Artifact[] }> {
  core.info("");
  core.info("Export Artifacts:");

  // Generate app path patterns based on module, variants, and build type
  const appPathPatterns = generateAppPathPatterns(config.module, config.variants, config.artifactType);

  core.info("Generated search patterns:");
  appPathPatterns.forEach((pattern) => core.info(`  ${pattern}`));

  const appArtifacts = await getArtifacts(config.projectLocation, started, appPathPatterns, false, config);

  printAppSearchInfo(appArtifacts, appPathPatterns);

  core.info(`Exporting artifacts with the selected app type: ${config.artifactType}`);

  // Filter appFiles by build type
  const filteredArtifacts = appArtifacts.filter((artifact) => getFileExtension(artifact.path) === `.${config.artifactType}`);

  if (filteredArtifacts.length === 0) {
    core.warning(`No app artifacts found with generated patterns:\n${appPathPatterns.join("\n")}`);
    core.warning(
      "If you have customized APK/AAB output paths in your gradle files, the automatic pattern generation may not find your artifacts.",
    );
  }

  return {
    appFiles: filteredArtifacts,
  };
}

async function getArtifacts(
  projectLocation: string,
  started: Date,
  patterns: string[],
  includeModule: boolean,
  config: Config,
): Promise<Artifact[]> {
  const artifacts: Artifact[] = [];

  for (const pattern of patterns) {
    try {
      const afs = await findArtifacts(projectLocation, started, pattern, includeModule, config);
      artifacts.push(...afs);
    } catch (error) {
      core.warning(`Failed to find artifact with pattern ( ${pattern} ), error: ${error}`);
      continue;
    }
  }

  if (artifacts.length === 0) {
    if (started.getTime() > 0) {
      core.warning(`No app files found with patterns: ${patterns.join(", ")} that has modification time after: ${started}`);
      core.warning("Retrying without modtime check....");
      core.info("");
      return getArtifacts(projectLocation, new Date(0), patterns, includeModule, config);
    }
    core.warning(`No app files found with pattern: ${patterns.join(", ")} without modtime check`);
  }

  return artifacts;
}

async function findArtifacts(
  projectLocation: string,
  generatedAfter: Date,
  pattern: string,
  includeModuleInName: boolean,
  config: Config,
): Promise<Artifact[]> {
  const artifacts: Artifact[] = [];

  try {
    const globber = await glob.create(pattern, {
      followSymbolicLinks: false,
      implicitDescendants: true,
    });

    const files = await globber.glob();

    for (const file of files) {
      try {
        const stats = await fs.promises.stat(file);

        // Check if file was generated after the specified time
        if (generatedAfter && stats.mtime < generatedAfter) {
          continue;
        }

        let artifactName = getBaseName(file);

        if (includeModuleInName) {
          // Try to extract module name from path
          const relativePath = path.relative(projectLocation, file);
          const pathParts = relativePath.split(path.sep);

          // Look for module name in path (usually before 'build')
          let moduleName = "";
          for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === "build" && i > 0) {
              moduleName = pathParts[i - 1];
              break;
            }
          }

          if (moduleName && moduleName !== ".") {
            const ext = path.extname(artifactName);
            const nameWithoutExt = artifactName.substring(0, artifactName.length - ext.length);
            artifactName = `${nameWithoutExt}-${moduleName}${ext}`;
          }
        }

        artifacts.push({
          path: file,
          name: artifactName,
          type: config.artifactType,
        });
      } catch (error) {
        core.warning(`Failed to stat file ${file}: ${error}`);
      }
    }
  } catch (error) {
    throw new Error(`Failed to find artifacts with pattern ${pattern}: ${error}`);
  }

  return artifacts;
}

function printAppSearchInfo(appArtifacts: Artifact[], appPathPatterns: string[]): void {
  const artPaths = appArtifacts.map((a) => a.name);

  core.info("Used patterns for generated artifact search:");
  core.info(appPathPatterns.join("\n"));
  core.info("");
  core.info("Found app artifacts:");
  core.info(artPaths.join("\n"));
  core.info("");
}
