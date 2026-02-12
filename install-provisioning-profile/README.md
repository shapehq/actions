## [install-provisioning-profile](https://github.com/shapehq/actions/blob/main/install-provisioning-profile/action.yml)

Installs a provisioning profile.

```yml
- name: Install Provisioning Profile
  uses: shapehq/actions/install-provisioning-profile@v1
  with:
    provisioning-profile-base64: ${{ secrets.PROVISIONING_PROFILE_BASE64 }}
```

Alternatively, provide a file path to a provisioning profile:

```yml
- name: Install Provisioning Profile
  uses: shapehq/actions/install-provisioning-profile@v1
  with:
    provisioning-profile-file: ${{ env.PROVISIONING_PROFILE_PATH }}
```
