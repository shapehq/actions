# Actions

This repository contains actions to be used with [GitHub Actions](https://github.com/features/actions) internally at Shape. Please refer to [this article](https://shapedk.atlassian.net/wiki/spaces/SHAPE/pages/3640262736/GitHub+Actions+Runners) for the details on getting started with our self-hosted GitHub Actions runner.

## Getting Started

Several of these actions depend on the 1Password CLI being installed. Please use 1Password's [install-cli-action](https://github.com/1Password/install-cli-action) action to install the 1Password CLI.

## [build-and-upload-to-app-store-connect](https://github.com/shapehq/actions/blob/main/build-and-upload-to-app-store-connect/action.yml)

Builds an Xcode project, archives the app, exports an IPA from the archive, and uploads it to App Store Connect.
As a side effect, the action will upload the dSYM files as an artifact to the job.

```yml
- name: Build and Upload to App Store Connect
  uses: shapehq/actions/build-and-upload-to-app-store-connect@main
  with:
    scheme: Example
    configuration: Debug
    op-app-store-connect-api-key-issuer-id-reference: op://GitHub Actions/Company App Store Connect API Key/Issuer ID
    op-app-store-connect-api-key-id-reference: op://GitHub Actions/Company App Store Connect API Key/Key ID
    op-app-store-connect-api-key-file-reference: op://GitHub Actions/Company App Store Connect API Key/AuthKey.p8
    op-development-certificate-reference: op://GitHub Actions/Company Development Certificate/Certificate.p12
    op-development-certificate-password-reference: op://GitHub Actions/Company Development Certificate/password
```

You may use the `marketing-version` and `build-number` inputs to automatically set a version number and build number prior to building the project.

```yml
- name: Build and Upload to App Store Connect
  uses: shapehq/actions/build-and-upload-to-app-store-connect@main
  with:
    scheme: Example
    configuration: Debug
    marketing-version: ${{ inputs.version_number }}
    build-number: ${{ github.run_number }}
    op-app-store-connect-api-key-issuer-id-reference: op://GitHub Actions/Company App Store Connect API Key/Issuer ID
    op-app-store-connect-api-key-id-reference: op://GitHub Actions/Company App Store Connect API Key/Key ID
    op-app-store-connect-api-key-file-reference: op://GitHub Actions/Company App Store Connect API Key/AuthKey.p8
    op-development-certificate-reference: op://GitHub Actions/Company Development Certificate/Certificate.p12
    op-development-certificate-password-reference: op://GitHub Actions/Company Development Certificate/password
```

The action supports the following inputs.

|Name|Required|Default Value|Description|
|-|-|-|-|
|scheme|Yes||The Xcode project's scheme to build. This specifies which set of build settings and targets to use when building your app.|
|configuration|Yes|Release|Specifies the build configuration that Xcode should use. Commonly set to "Release" for production builds meant for App Store distribution.|
|marketing-version|No||The marketing version number of the app, such as "1.0.0". This sets the MARKETING_VERSION in Xcode, determining the version displayed on the App Store.|
|build-number|No||An incrementing number specifying the build version, which is used to uniquely identify an archive or build sent to the App Store Connect.|
|testflight-internal-testing-only|Yes|false|When enabled, the build cannot be distributed via external TestFlight or the App Store. Must be either "true" or "false".|
|op-app-store-connect-api-key-issuer-id-reference|Yes||A reference to the location in 1Password where the Issuer ID for the App Store Connect API key is stored. This ID is crucial for API interactions with App Store Connect.|
|op-app-store-connect-api-key-id-reference|Yes||A reference to the location in 1Password where the App Store Connect API Key ID is stored, used for authentication during API requests.|
|op-app-store-connect-api-key-file-reference|Yes||A reference to the 1Password field containing the AuthKey.p8 file, essential for establishing connections to App Store Connect.|
|op-development-certificate-reference|Yes||Points to a field in 1Password where the development certificate and its corresponding private key (.p12 file) are stored, necessary for signing the app during the development phase.|
|op-development-certificate-password-reference|Yes||Indicates the location in 1Password where the password for decrypting the development certificate (.p12 file) is kept.|
|additional-archive-args|No||Additional arguments passed to xcodebuild when archiving the app.|
|build-directory|Yes|.build|Defines the directory where the build artifacts, like the final binary or intermediate files, will be stored.|

## [install-appiconannotator](https://github.com/shapehq/actions/blob/main/install-appiconannotator/action.yml)

Installs [appiconannotator](https://github.com/shapehq/appiconannotator).

```yml
- name: Install appiconannotator
  uses: shapehq/actions/install-appiconannotator@main
```

## [install-artifactory-profile](https://github.com/shapehq/actions/blob/main/install-artifactory-profile/action.yml)

Installs a [JFrog Artifactory](https://artifactory.shapeapp.dk/) profile with read access to internal artifacts.

```yml
- name: Install JFrog Artifactory profile
  uses: shapehq/actions/install-artifactory-profile@main
```

## [install-asc-api-key](https://github.com/shapehq/actions/tree/main/install-asc-api-key/action.yml)

Installs an App Store Connect API key file on the runner and outputs the issuer ID, key ID, and file path of the AuthKey file.

```yml
- name: Install App Store Connect API Key
  id: install-asc-api-key
  uses: shapehq/actions/install-asc-api-key@main
  with:
    op-asc-key-issuer-id-reference: op://My Vault/My App Store Connect API Key/Issuer ID
    op-asc-key-id-reference: op://My Vault/My App Store Connect API Key/Key ID
    op-asc-key-file-reference: op://My Vault/My App Store Connect API Key/AuthKey.p8
```

You may optionally pass the `output-asc-key-file-directory` parameter to specify the directory in which to store the AuthKey file. This defaults to the current directory.

```yml
- name: Install App Store Connect API Key
  id: install-asc-api-key
  uses: shapehq/actions/install-asc-api-key@main
  with:
    op-asc-key-issuer-id-reference: op://My Vault/My App Store Connect API Key/Issuer ID
    op-asc-key-id-reference: op://My Vault/My App Store Connect API Key/Key ID
    op-asc-key-file-reference: op://My Vault/My App Store Connect API Key/AuthKey.p8
    output-asc-key-file-directory: ./private_keys
```

The action has the following outputs:

|Name|Description|
|-|-|
|issuer_id|The issuer ID.|
|key_id|The key ID.|
|key_filename|The name of the stored AuthKey file. This will be on the format `AuthKey_[KeyID].p8`.|
|key_file_path|The file path to the AuthKey.|

The outputs can be used to access the API key. The following example shows how the outputs can be passed to Fastlane.

```yml
- name: Fastlane
  run: bundle exec fastlane build_appstore
  env:          
    ASC_API_KEY_ISSUER_ID: ${{ steps.install-asc-api-key.outputs.issuer-id }}
    ASC_API_KEY_ID: ${{ steps.install-asc-api-key.outputs.key-id }}
    ASC_API_KEY: ${{ steps.install-asc-api-key.outputs.key-file-path }}
```

## [install-certificate](https://github.com/shapehq/actions/blob/main/install-certificate/action.yml)

Installs the specified certificate in the keychain.

```yml
- name: Install Certificate
  uses: shapehq/actions/install-certificate@main
  with:
    password-op-reference: op://My Vault/My Certificate/password
    certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
```

Note that you must supply a password. Empty passwords are not supported.

The action makes the keychain the default keychain on the system. You can disable this as shown below.

```yml
- name: Install Certificate
  uses: shapehq/actions/install-certificate@main
  with:
    password-op-reference: op://My Vault/My Certificate/password
    certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
    set-default-keychain: false
```

You may optionally specify the name of the keychain to install the certificate and the password of that keychain.

```yml
- name: Install Certificate
  uses: shapehq/actions/install-certificate@main
  with:
    password-op-reference: op://My Vault/My Certificate/password
    certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
    keychain-name: signing.keychain
    keychain-password: h3ll0w0rld
```

The keychain will be created with a random password if no password is specified. Therefore you will need to specify a password when installing multiple certificates into the same keychain. You may consider using the `uuidgen` command to create a random password as shown below.

```yml
- name: Generate Keychain Password
  id: generate-keychain-password
  run: |
    PASSWORD=$(uuidgen)
    echo "::add-mask::$PASSWORD"
    echo "password=$PASSWORD" >> $GITHUB_OUTPUT
- name: Install First Certificate
  uses: shapehq/actions/install-certificate@main
  with:
    password-op-reference: op://My Vault/First Certificate/password
    certificate-op-reference: op://My Vault/First Certificate/Certificate.p12
    keychain-password: ${{ steps.generate-keychain-password.outputs.password }}
- name: Install Second Certificate
  uses: shapehq/actions/install-certificate@main
  with:
    password-op-reference: op://My Vault/Second Certificate/password
    certificate-op-reference: op://My Vault/Second Certificate/Certificate.p12
    keychain-password: ${{ steps.generate-keychain-password.outputs.password }}
```

## [install-ci-ssh-key](https://github.com/shapehq/actions/blob/main/install-ci-ssh-key/action.yml)

Install the CI's SSH key.

```yml
- name: Install CI SSH Key
  uses: shapehq/actions/install-ci-ssh-key@main
```

You may optionally specify the name of the file to store the SSH key in. Only do this if you are storing multiple SSH keys to avoid overriding an SSH key.

```yml
- name: Install CI SSH Key
  uses: shapehq/actions/install-ci-ssh-key@main
  with:
    filename: ci
```

Use the [install-ssh-key](https://github.com/shapehq/actions/edit/main/README.md#install-ssh-key) action to install a specified SSH key.

## [install-company-asc-api-key](https://github.com/shapehq/actions/tree/main/install-company-asc-api-key/action.yml)

Installs our company App Store Connect API key file on the runner and outputs the issuer ID, key ID, and file path of the AuthKey file.

```yml
- name: Install Company App Store Connect API Key
  id: install-company-asc-api-key
  uses: shapehq/actions/install-company-asc-api-key@main
```

You may optionally pass the `output-asc-key-file-directory` parameter to specify the directory in which to store the AuthKey file. This defaults to the current directory.

```yml
- name: Install Company App Store Connect API Key
  id: install-company-asc-api-key
  uses: shapehq/actions/install-company-asc-api-key@main
  with:
    output-asc-key-file-directory: ./private_keys
```

The action has the following outputs:

|Name|Description|
|-|-|
|issuer_id|The issuer ID.|
|key_id|The key ID.|
|key_filename|The name of the stored AuthKey file. This will be on the format `AuthKey_[KeyID].p8`.|
|key_file_path|The file path to the AuthKey.|

The outputs can be used to access the API key. The following example shows how the outputs can be passed to Fastlane.

```yml
- name: Fastlane
  run: bundle exec fastlane build_appstore
  env:          
    ASC_API_KEY_ISSUER_ID: ${{ steps.install-asc-api-key.outputs.issuer-id }}
    ASC_API_KEY_ID: ${{ steps.install-asc-api-key.outputs.key-id }}
    ASC_API_KEY: ${{ steps.install-asc-api-key.outputs.key-file-path }}
```

Use the [install-asc-api-key](https://github.com/shapehq/actions/edit/main/README.md#install-asc-api-key) action to install a specified App Store Connect API key.

## [install-company-development-certificate](https://github.com/shapehq/actions/blob/main/install-company-development-certificate/action.yml)

Installs Shape's default company development certificate in the keychain.

```yml
- name: Install Company Development Certificate
  uses: shapehq/actions/install-company-development-certificate@main
```

The action makes the keychain the default keychain on the system. You can disable this as shown below.

```yml
- name: Install Company Development Certificate
  uses: shapehq/actions/install-company-development-certificate@main
  with:
    set-default-keychain: false
```

You may optionally specify the name of the keychain to install the certificate and the password of that keychain.

```yml
- name: Install Company Development Certificate
  uses: shapehq/actions/install-company-development-certificate@main
  with:
    keychain-name: signing.keychain
    keychain-password: h3ll0w0rld
```

Use the [install-certificate](https://github.com/shapehq/actions/edit/main/README.md#install-certificate) action to install a specified certificate.

## [install-company-distribution-certificate](https://github.com/shapehq/actions/blob/main/install-company-distribution-certificate/action.yml)

Installs Shape's default company distribution certificate in the keychain.

```yml
- name: Install Company Distribution Certificate
  uses: shapehq/actions/install-company-distribution-certificate@main
```

The action makes the keychain the default keychain on the system. You can disable this as shown below.

```yml
- name: Install Company Distribution Certificate
  uses: shapehq/actions/install-company-distribution-certificate@main
  with:
    set-default-keychain: false
```

You may optionally specify the name of the keychain to install the certificate and the password of that keychain.

```yml
- name: Install Company Distribution Certificate
  uses: shapehq/actions/install-company-distribution-certificate@main
  with:
    keychain-name: signing.keychain
    keychain-password: h3ll0w0rld
```

Use the [install-certificate](https://github.com/shapehq/actions/edit/main/README.md#install-certificate) action to install a specified certificate.

## [install-provisioning-profile](https://github.com/shapehq/actions/blob/main/install-provisioning-profile/action.yml)

Installs a provisioning profile.

```yml
- name: Install Provisioning Profile
  uses: shapehq/actions/install-provisioning-profile@main
  with:
    op-reference: op://My Vault/My Provisioning Profile/profile.mobileprovision
```

## [install-shipshape](https://github.com/shapehq/actions/blob/main/install-shipshape/action.yml)

Installs Shipshape and sets an activation code.

```yml
- name: Install Shipshape
  uses: shapehq/actions/install-shipshape@main
```

You may optionally specify an activation code to be used by Shipshape. You will likely want to use the default activation code though.

```yml
- name: Install CI SSH Key
  uses: shapehq/actions/install-shipshape@main
  with:
    op-reference: op://My Vault/My Shipshape Activation Code/password
```

## [install-ssh-key](https://github.com/shapehq/actions/tree/main/install-ssh-key/action.yml)

Installs an SSH key.

```yml
- name: Install SSH Key
  uses: shapehq/actions/install-ssh-key@main
  with:
    op-reference: op://My Vault/My SSH Key/ssh-key
```

You may optionally specify the name of the file to store the SSH key in. Only do this if you are storing multiple SSH keys to avoid overriding an SSH key.

```yml
- name: Install SSH Key
  uses: shapehq/actions/install-ssh-key@main
  with:
    op-reference: op://My Vault/My SSH Key/ssh-key
    filename: my_key
```

## [jira-comment](https://github.com/shapehq/actions/tree/main/jira-comment/action.yml)

Adds comment to a Jira issue.

```yml
- name: Add comment to a Jira issue
  uses: shapehq/actions/jira-comment@main
  with:
    message: This issue is included in *Solar* v. ${{ inputs.marketing_version }} (${{ github.run_number }}) available on Shipshape.
    issues: ${{ steps.changelog.outputs.issues }}
    jira-base-url: https://shapedk.atlassian.net
    jira-user-email: ci@shape.dk
    op-jira-api-token-reference: op://My Vault/Shape CI Bot API Token for Jira credentials
```

## [jira-issues-changelog](https://github.com/shapehq/actions/tree/main/jira-issues-changelog/action.yml)

Outputs a list of Jira issue keys mentioned in commit messages between the current commit you are at and the most recent tag that does not include the inputted app version. For example, let's say you are on a release branch for a version 1.1.0 of an app. This action will then look for Jira issue keys mentioned in commit messages between your current commit and the most recent tag that does not contain "1.1.0", which would for example be your latest 1.0.0 release. This should ensure we find all issues included in the 1.1.0 release.

```yml
- name: Jira issues from changelog
  id: changelog
  uses: shapehq/actions/jira-issues-changelog@main
  with:
    jira-project-id: Jira project ID, e.g. SL
    marketing-version: Marketing version, e.g. 1.0.0
```

## [loco-translation-status-checker](https://github.com/shapehq/actions/tree/main/loco-translation-status-checker/action.yml)

Checks if there are missing translations in the Localize.biz project throws error.

```yml
- name: Verify Loco Translations
  uses: shapehq/actions/loco-translation-status-checker@main
  with:
    op-loco-api-key-reference: op://My Vault/My Loco API Key/key
```

## [loco-translation-status-poster](https://github.com/shapehq/actions/tree/main/loco-translation-status-poster/action.yml)

Checks if there are missing translations in the Localize.biz project and posts warning to Slack.

```yml
- name: Verify Loco Translations and Post to Slack
  uses: shapehq/actions/loco-translation-status-poster@main
  with:
    channel: "#my-channel"
    op-slack-token-reference: op://My Vault/My Slack Token/token
    op-loco-api-key-reference: op://My Vault/My Loco API Key/key
```

## [post-slack-message](https://github.com/shapehq/actions/tree/main/post-slack-message/action.yml)

Posts a message to Slack.

```yml
- name: Post to Slack
  uses: shapehq/actions/post-slack-message@main
  with:
    channel: "#my-channel"
    message: "Started a new build of Project X for App Store 🏃‍♀️"
    op-slack-token-reference: op://My Vault/My Slack Token/token
```

The action will automatically add the following details to the Slack message:
* Workflow name
* Runner name
* Branch name
* GitHub profile of the person who started the job

If you wish to only post to Slack if the jobs fails you can use the `failure()` status check function:

```yml
- name: Post failure to Slack
  if: ${{ failure() }}
  uses: shapehq/actions/post-slack-message@main
  with:
    channel: "#my-channel"
    message: "Project X build for App Store failed 💥"
    op-slack-token-reference: op://My Vault/My Slack Token/token
```

You may use the Slack token residing in the shared GitHub Actions vault to post messages.

```yml
- name: Post to Slack
  uses: shapehq/actions/post-slack-message@main
  with:
    channel: "#my-channel"
    message: "Started a new build of Project X for App Store 🏃‍♀️"
    op-slack-token-reference: op://GitHub Actions/Slack Token/token
```

## [render-ios-app-icon-badge](https://github.com/shapehq/actions/tree/main/render-ios-app-icon-badge/action.yml)

Adds a badge to an iOS app icon to indicate that the app is meant for testing purposes.

```yml
- name: Render iOS App Icon Badge
  uses: shapehq/actions/render-ios-app-icon-badge@main
```

The action scans for app icons in the repository and automatically annotates all app icons it finds. You may optionally specify the root folder it should start scanning from, to limit the app icons to be annotated and improve performance.

```yml
- name: Render iOS App Icon Badge
  uses: shapehq/actions/render-ios-app-icon-badge@main
  with:
    search-directory: ./my/other/folder
```

The action automatically picks an appropriate color for the curl in the top-right corner. You may override this color by providing a hex color value to the `curl-color` argument.

```yml
- name: Render iOS App Icon Badge
  uses: shapehq/actions/render-ios-app-icon-badge@main
  with:
    curl-color: #1CC866
```

To only annotate the app icon when building a specific configuration of your app, you can use GitHub Actions' `if` argument. For example, in the following snippet, the action is only run when the user has chosen to run the workflow for the Beta configuration.

```yml
- name: Add Badge to App Icon
  if: ${{ inputs.configuration == 'Beta' }}
  uses: shapehq/actions/render-ios-app-icon-badge@main
```

## [swiftlint](https://github.com/shapehq/actions/tree/main/swiftlint/action.yml)

Runs [SwiftLint](https://github.com/realm/SwiftLint) on a codebase.

```yml
- name: SwiftLint
  uses: shapehq/actions/swiftlint@main
```

You may optionally run SwiftLint in strict mode as shown below. This treats warnings as errors.

```yml
- name: SwiftLint
  uses: shapehq/actions/swiftlint@main
  with:
    args: --strict
```

The motivation for using this over running the `swiftlint` CLI directly is that this action can be run on an Ubuntu runner.
Consider running the `swiftlint` CLI directly if you are using a macOS runner.

```yml
- name: SwiftLint
  runs: swiftlint --quiet --strict --reporter github-actions-logging
```

## [upload-apk-shipshape](https://github.com/shapehq/actions/tree/main/upload-apk-shipshape/action.yml)

Uploads an APK to Shipshape.

The action has the following inputs:

|Name|Description|
|-|-|
|projectName|The project/client name.|
|targetName|The project name with the build variant.|
|apkPath|The path to the APK file that needs to be uploaded.|
|manifestPath|The path to the AndroidManifest.xml for the same build.|
|appIconPath|The path to a PNG icon to be shown in Shipshape.|
|distributionListDefinitions|The available distribution lists in JSON format. E.g. `{"Shape": ["a@shape.dk", "b@shape.dk"], "Client": ["a@example.com", "b@example.com"]}`|
|distributionListTargets|The distribution lists that will receive the builds, comma-separated. Should be one or more of the keys in `distributionListDefinitions`. E.g. `Shape,Client`.|
|releaseNotes|The release notes that are going to be shown in Shipshape for this build.|

Example:
```yml
- name: Upload to Shipshape
  uses: shapehq/actions/upload-apk-shipshape@main
  with:
    projectName: Client
    targetName: Client (${{ env.BUILD_TYPE }})
    apkPath: app/build/outputs/apk/${{ env.BUILD_TYPE }}/app-${{ env.BUILD_TYPE }}.apk
    manifestPath: app/build/intermediates/merged_manifests/${{ env.BUILD_TYPE }}/AndroidManifest.xml
    appIconPath: shipshape_icon.png
    distributionListDefinitions: ${{ vars.DISTRIBUTION_LISTS }}
    distributionListTargets: ${{ github.event.inputs.DISTRIBUTION_LISTS }}
    releaseNotes: ${{ github.event.inputs.RELEASE_NOTES }}
```

## [upload-artifact-play-store](https://github.com/shapehq/actions/tree/main/upload-artifact-play-store/action.yml)

Uploads a release build (.apk or .aab) to the internal track of the Play Store.

```yml
- name: Upload to Google Play
  uses: shapehq/actions/upload-artifact-play-store@main
  with:
    serviceAccountKeyPath: play_service_account.json
    packageName: com.example.app
    bundlePath: app/build/outputs/bundle/release/app-release.aab
```

## [xcode-select](https://github.com/shapehq/actions/tree/main/xcode-select)

Selects a version of Xcode. The major, minor, and patch values must all be specified, otherwise the action will throw an error.

The following will pin against the major and minor version, so the action may select Xcode 14.3 or Xcode 14.3.1.

```yaml
- name: Select Xcode Version
  uses: shapehq/actions/xcode-select@main
  with:
    version: 14.3.x
```

The following will pin against an exact version of Xcode and will not select any other version than the one specified.

```yaml
- name: Select Xcode Version
  uses: shapehq/actions/xcode-select@main
  with:
    version: 14.3.1
```

The following will pin against the major version only, so the action may select version 14.0, 14.3, or 14.3.1.

```yaml
- name: Select Xcode Version
  uses: shapehq/actions/xcode-select@main
  with:
    version: 14.x.x
```

> **Note**
> It is recommended to pin against a major and minor version of Xcode and leave the patch as a placeholder. The storage on GitHub Actions runners is limited and patch versions will be deleted and replaced without any prior communication.
