## [build-and-upload-to-app-store-connect](https://github.com/shapehq/actions/blob/main/build-and-upload-to-app-store-connect/action.yml)

Builds an Xcode project, archives the app, exports an IPA from the archive, and uploads it to App Store Connect.
As a side effect, the action will upload the dSYM files as an artifact to the job.

```yml
- name: Build and Upload to App Store Connect
  uses: shapehq/actions/build-and-upload-to-app-store-connect@v1
  with:
    scheme: Example
    configuration: Debug
    app-store-connect-api-key-issuer-id: ${{ secrets.ASC_KEY_ISSUER_ID }}
    app-store-connect-api-key-id: ${{ secrets.ASC_KEY_ID }}
    app-store-connect-api-key-base64: ${{ secrets.ASC_KEY_BASE64 }}
    development-certificate-base64: ${{ secrets.DEVELOPMENT_CERTIFICATE_BASE64 }}
    development-certificate-password: ${{ secrets.DEVELOPMENT_CERTIFICATE_PASSWORD }}
```

You may use the `marketing-version` and `build-number` inputs to automatically set a version number and build number prior to building the project.

```yml
- name: Build and Upload to App Store Connect
  uses: shapehq/actions/build-and-upload-to-app-store-connect@v1
  with:
    scheme: Example
    configuration: Debug
    marketing-version: ${{ inputs.version_number }}
    build-number: ${{ github.run_number }}
    app-store-connect-api-key-issuer-id: ${{ secrets.ASC_KEY_ISSUER_ID }}
    app-store-connect-api-key-id: ${{ secrets.ASC_KEY_ID }}
    app-store-connect-api-key-base64: ${{ secrets.ASC_KEY_BASE64 }}
    development-certificate-base64: ${{ secrets.DEVELOPMENT_CERTIFICATE_BASE64 }}
    development-certificate-password: ${{ secrets.DEVELOPMENT_CERTIFICATE_PASSWORD }}
```

The action supports the following inputs.

| Name                                             | Required | Default Value | Description                                                                                                                                                                            |
| ------------------------------------------------ | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| working-directory                                | Yes      | .             | The directory to run the action in. This should be the directory in which the Xcode project resides.                                                                                   |
| scheme                                           | Yes      |               | The Xcode project's scheme to build. This specifies which set of build settings and targets to use when building your app.                                                             |
| configuration                                    | Yes      | Release       | Specifies the build configuration that Xcode should use. Commonly set to "Release" for production builds meant for App Store distribution.                                             |
| marketing-version                                | No       |               | The marketing version number of the app, such as "1.0.0". This sets the MARKETING_VERSION in Xcode, determining the version displayed on the App Store.                                |
| build-number                                     | No       |               | An incrementing number specifying the build version, which is used to uniquely identify an archive or build sent to the App Store Connect.                                             |
| testflight-internal-testing-only                 | Yes      | false         | When enabled, the build cannot be distributed via external TestFlight or the App Store. Must be either "true" or "false".                                                              |
| app-store-connect-api-key-issuer-id              | Yes      |               | Issuer ID for the App Store Connect API key.                                                                                                                                            |
| app-store-connect-api-key-id                     | Yes      |               | App Store Connect API Key ID.                                                                                                                                                            |
| app-store-connect-api-key-base64                 | No       |               | Base64-encoded AuthKey.p8 file. Provide this or `app-store-connect-api-key-file`.                                                                                                        |
| app-store-connect-api-key-file                   | No       |               | Path to an AuthKey.p8 file. Provide this or `app-store-connect-api-key-base64`.                                                                                                          |
| development-certificate-base64                   | No       |               | Base64-encoded development certificate (.p12). Provide this or `development-certificate-file`.                                                                                          |
| development-certificate-file                     | No       |               | Path to a development certificate (.p12). Provide this or `development-certificate-base64`.                                                                                             |
| development-certificate-password                 | Yes      |               | Password for decrypting the development certificate (.p12 file).                                                                                                                         |
| additional-archive-args                          | No       |               | Additional arguments passed to xcodebuild when archiving the app.                                                                                                                      |
| additional-altool-args                           | No       |               | Additional arguments passed to altool when uploading the app.                                                                                                                          |
| build-directory                                  | Yes      | .build        | Defines the directory where the build artifacts, like the final binary or intermediate files, will be stored.                                                                          |
| dsyms-archive-name                               | Yes      | dSYMs         | Name of the uploaded archive containing the dSYMs.                                                                                                                                     |
| pretty-xcodebuild-output                         | Yes      | true          | Whether to pipe xcodebuild output through [xcbeautify](https://github.com/cpisciotta/xcbeautify) for prettier formatting.                                                              |
