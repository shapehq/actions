import * as core from "@actions/core";
import * as path from "path";
import { Result, APK_APP_TYPE, APK_ENV_KEY, AAB_ENV_KEY, APK_LIST_ENV_KEY, AAB_LIST_ENV_KEY, AAB_APP_TYPE } from "../types";

export async function exportResult(result: Result): Promise<void> {
  if (result.appFiles.length === 0) {
    throw new Error("Could not find any app artifacts");
  }

  // Group artifacts by type
  const apkArtifacts = result.appFiles.filter((artifact) => artifact.type === APK_APP_TYPE);
  const aabArtifacts = result.appFiles.filter((artifact) => artifact.type === AAB_APP_TYPE);

  // Set outputs for APK artifacts if any exist
  if (apkArtifacts.length > 0) {
    const lastApkArtifact = apkArtifacts[apkArtifacts.length - 1];
    core.setOutput(APK_ENV_KEY, lastApkArtifact.path);
    core.info("");
    core.info(`  Output [ ${APK_ENV_KEY} = ${path.basename(lastApkArtifact.path)} ]`);

    const apkPaths = apkArtifacts.map((artifact) => artifact.path).join("|");
    core.setOutput(APK_LIST_ENV_KEY, apkPaths);
    core.info(`  Output [ ${APK_LIST_ENV_KEY} = ${apkArtifacts.map((a) => path.basename(a.path)).join("|")} ]`);
  }

  // Set outputs for AAB artifacts if any exist
  if (aabArtifacts.length > 0) {
    const lastAabArtifact = aabArtifacts[aabArtifacts.length - 1];
    core.setOutput(AAB_ENV_KEY, lastAabArtifact.path);
    core.info("");
    core.info(`  Output [ ${AAB_ENV_KEY} = ${path.basename(lastAabArtifact.path)} ]`);

    const aabPaths = aabArtifacts.map((artifact) => artifact.path).join("|");
    core.setOutput(AAB_LIST_ENV_KEY, aabPaths);
    core.info(`  Output [ ${AAB_LIST_ENV_KEY} = ${aabArtifacts.map((a) => path.basename(a.path)).join("|")} ]`);
  }

  // Log summary
  core.info("");
  core.info(`Total artifacts exported: ${result.appFiles.length}`);
  if (apkArtifacts.length > 0) {
    core.info(`  APK artifacts: ${apkArtifacts.length}`);
  }
  if (aabArtifacts.length > 0) {
    core.info(`  AAB artifacts: ${aabArtifacts.length}`);
  }
}
