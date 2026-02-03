## [install-provisioning-profile](https://github.com/shapehq/actions/blob/main/install-provisioning-profile/action.yml)

Installs a provisioning profile.

```yml
- name: Install Provisioning Profile
  uses: shapehq/actions/install-provisioning-profile@v1
  with:
    op-reference: op://My Vault/My Provisioning Profile/profile.mobileprovision
```