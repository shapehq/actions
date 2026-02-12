## [install-asc-api-key](https://github.com/shapehq/actions/tree/main/install-asc-api-key/action.yml)

Installs an App Store Connect API key file on the runner and outputs the issuer ID, key ID, and file path of the AuthKey file.

```yml
- name: Install App Store Connect API Key
  id: install-asc-api-key
  uses: shapehq/actions/install-asc-api-key@v1
  with:
    asc-key-issuer-id: ${{ secrets.ASC_KEY_ISSUER_ID }}
    asc-key-id: ${{ secrets.ASC_KEY_ID }}
    asc-key-base64: ${{ secrets.ASC_KEY_BASE64 }}
```

You may optionally pass the `output-asc-key-file-directory` parameter to specify the directory in which to store the AuthKey file. This defaults to the current directory.

If you already have the AuthKey file on disk, you can pass `asc-key-file` instead of `asc-key-base64`.

```yml
- name: Install App Store Connect API Key
  id: install-asc-api-key
  uses: shapehq/actions/install-asc-api-key@v1
  with:
    asc-key-issuer-id: ${{ secrets.ASC_KEY_ISSUER_ID }}
    asc-key-id: ${{ secrets.ASC_KEY_ID }}
    asc-key-base64: ${{ secrets.ASC_KEY_BASE64 }}
    output-asc-key-file-directory: ./private_keys
```

The action has the following outputs:

| Name          | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| issuer_id     | The issuer ID.                                                                        |
| key_id        | The key ID.                                                                           |
| key_filename  | The name of the stored AuthKey file. This will be on the format `AuthKey_[KeyID].p8`. |
| key_file_path | The file path to the AuthKey.                                                         |

The outputs can be used to access the API key. The following example shows how the outputs can be passed to Fastlane.

```yml
- name: Fastlane
  run: bundle exec fastlane build_appstore
  env:
    ASC_API_KEY_ISSUER_ID: ${{ steps.install-asc-api-key.outputs.issuer-id }}
    ASC_API_KEY_ID: ${{ steps.install-asc-api-key.outputs.key-id }}
    ASC_API_KEY: ${{ steps.install-asc-api-key.outputs.key-file-path }}
```
