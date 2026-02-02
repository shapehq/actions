## [upload-artifact-play-store](https://github.com/shapehq/actions/tree/main/upload-artifact-play-store/action.yml)

Uploads a release build (.apk or .aab) to the internal track of the Play Store.

```yml
- name: Upload to Google Play
  id: upload
  uses: shapehq/actions/upload-artifact-play-store@v1
  with:
    serviceAccountKeyPath: play_service_account.json
    packageName: com.example.app
    bundlePath: app/build/outputs/bundle/release/app-release.aab
    proguardMappingFilePath: app/build/outputs/mapping/release/mapping.txt
```

The action has the following inputs:

| Name                      | Required | Description                                                                  |
| ------------------------- | -------- | ---------------------------------------------------------------------------- |
| `serviceAccountKeyPath`   | Yes      | File path to the Google Play service account key                             |
| `packageName`             | Yes      | Package name (application id)                                                |
| `bundlePath`              | Yes      | File path to the release file to be uploaded (.apk/.aab)                     |
| `proguardMappingFilePath` | No       | File path to a Proguard/R8 mapping file to be uploaded in addition to an APK |

The action has the following outputs:

| Name                   | Description                                  |
| ---------------------- | -------------------------------------------- |
| `internal-sharing-url` | URL for internal sharing of the uploaded app |

Example of using the output:

```yml
- name: Use internal sharing URL
  run: echo "Internal sharing URL: ${{ steps.upload.outputs.internal-sharing-url }}"
```
