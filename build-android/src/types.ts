export type ArtifactType = typeof APK_APP_TYPE | typeof AAB_APP_TYPE;

export interface Config {
  projectLocation: string;
  variants: string[];
  module: string;
  artifactType: ArtifactType;
  arguments: string[];
}

export interface Result {
  appFiles: Artifact[];
}

export interface Artifact {
  path: string;
  name: string;
  type: ArtifactType;
}

export const APK_APP_TYPE = "apk";
export const AAB_APP_TYPE = "aab";

export const APK_ENV_KEY = "apk-path";
export const APK_LIST_ENV_KEY = "apk-path-list";
export const AAB_ENV_KEY = "aab-path";
export const AAB_LIST_ENV_KEY = "aab-path-list";
