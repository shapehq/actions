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

### Outputs

The action provides the following outputs:

- `file-path`: Path to the installed SSH key file.
- `key`: Raw content of the SSH key.

You can use these outputs to reduce usage of 1Password in workflows with multiple jobs, helping to avoid hitting API rate limits. Install the key once from 1Password in one job, then reuse it in other jobs:

```yml
jobs:
  install-key:
    runs-on: framna-dk-macos-default
    outputs:
      key: ${{ steps.install-ci-ssh-key.outputs.key }}
    steps:
      - name: Install CI SSH Key
        id: install-ci-ssh-key
        uses: shapehq/actions/install-ci-ssh-key@main

  reinstall-key:
    runs-on: framna-dk-macos-default
    needs: install-key
    steps:
      - name: Reinstall SSH Key
        uses: shapehq/actions/install-ssh-key@main
        with:
          key: ${{ needs.install-key.outputs.key }}
```

Use the [install-ssh-key](https://github.com/shapehq/actions?tab=readme-ov-file#install-ssh-key) action to install a specified SSH key.