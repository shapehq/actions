## [build-android](https://github.com/shapehq/actions/blob/main/build-android/action.yml)

Builds your Android project with Gradle and exposes the generated APK/AAB paths.

```yml
- name: Build Android
  id: build-android
  uses: shapehq/actions/build-android@v1
  with:
    project-location: .
    module: app
    variant: release
    artifact-type: apk
    arguments: --stacktrace
```

The action has the following inputs:

| Name             | Required | Default Value | Description                                                                                                                                                |
| ---------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| project-location | No       | .             | The root directory of your Android project (where the root build.gradle, gradlew, settings.gradle, etc. live).                                             |
| module           | No       | app           | The module to build. Find available modules in Android Studio under Project Structure.                                                                     |
| variant          | No       | debug         | The build variant(s) to create. Accepts multiple variants, comma-separated. Find available variants in Android Studio under Project Structure -> Variants. |
| artifact-type    | No       | apk           | The build artifact type to generate. Must be `apk` or `aab`.                                                                                               |
| arguments        | No       |               | Extra arguments passed to the Gradle task.                                                                                                                 |

The action has the following outputs:

| Name               | Description                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| artifact-path      | Path of the generated APK/AAB after filtering. If the build generates more than one matching artifact, this output contains the last one's path. |
| artifact-path-list | List of the generated APK/AAB paths after filtering. The paths are separated with `                                                              | ` characters. |
| manifest-path      | Path of the merged `AndroidManifest.xml` after filtering. If more than one match is found, this output contains the last one's path.             |
| manifest-path-list | List of the merged manifest paths after filtering. The paths are separated with `                                                                | ` characters. |
