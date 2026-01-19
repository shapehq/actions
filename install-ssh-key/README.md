## [install-ssh-key](https://github.com/shapehq/actions/tree/main/install-ssh-key/action.yml)

Installs an SSH key or a [deploy key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys), which is an SSH key that grants access to a single repository.

```yml
- name: Install SSH Key
  uses: shapehq/actions/install-ssh-key@v1
  with:
    ssh-key: ${{ secrets.SSH_KEY }}
```

Set the `ssh-key-password` input to install a password-protected SSH key.

```yml
- name: Install SSH Key
  uses: shapehq/actions/install-ssh-key@v1
  with:
    ssh-key: ${{ secrets.SSH_KEY }}
    ssh-key-password: ${{ secrets.SSH_KEY_PASSWORD }}
```

You may optionally specify the name of the file to store the SSH key in. Only do this if you are storing multiple SSH keys to avoid overriding an SSH key.

```yml
- name: Install SSH Key
  uses: shapehq/actions/install-ssh-key@v1
  with:
    ssh-key: ${{ secrets.SSH_KEY }}
    filename: my_ssh_key
```

If you already have the key on disk, you may pass `ssh-key-file` instead:

```yml
- name: Install SSH Key
  uses: shapehq/actions/install-ssh-key@v1
  with:
    ssh-key-file: ${{ env.SSH_KEY_PATH }}
```

If your key is base64-encoded, use `ssh-key-base64`.

Attempting to install multiple SSH keys with the same name will cause the SSH key to be overwritten.

When installing multiple SSH keys, you may need to specify which SSH key to use when accessing a repository. For example, you may clone a repository using a specific SSH key by setting the `GIT_SSH_COMMAND` environment variable as shown below:

```bash
GIT_SSH_COMMAND='ssh -i ~/.ssh/my_ssh_key’ git clone git@github.com:shapehq/example.git
```
