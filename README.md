# Actions

This repository contains actions to be used with [GitHub Actions](https://github.com/features/actions) internally at Shape. Please refer to [this article](https://shapedk.atlassian.net/wiki/spaces/SHAPE/pages/3640262736/GitHub+Actions+Runners) for the details on getting started with our self-hosted GitHub Actions runner.

## Getting Started

Several of these actions depend on the 1Password CLI being installed. Please use the [install-op-cli](https://github.com/simonbs/install-op-cli) action to install the 1Password CLI.

The examples in the following sections assume that your workflow clones this repository into the `./.actions` folder as shown below.

```yml
name: Checkout Actions Repository
uses: actions/checkout@v3
with:
  repository: shapehq/actions
  path: ./.actions
  ssh-key: ${{ secrets.ACTIONS_REPOSITORY_DEPLOY_KEY }}
```

Note that we use the deploy key stored in the `ACTIONS_REPOSITORY_DEPLOY_KEY` secret as SSH key when cloning this repository. This is necessary as we should use the [install-ci-ssh-key](https://github.com/shapehq/actions/edit/main/README.md#install-ci-ssh-key) in this repository to install our SSH key but we also need a key to clone this repository. All private repositories in Shape has access to the `ACTIONS_REPOSITORY_DEPLOY_KEY` secret.

## [install-appiconannotator](https://github.com/shapehq/actions/blob/main/install-appiconannotator/action.yml)

Installs [appiconannotator](https://github.com/shapehq/appiconannotator).

```yml
name: Install appiconannotator
uses: ./.actions/install-appiconannotator
```

## [install-certificate](https://github.com/shapehq/actions/blob/main/install-certificate/action.yml)

Installs the specified certificate in the keychain.

```yml
name: Install Certificate
uses: ./.actions/install-certificate
with:
  password-op-reference: op://My Vault/My Certificate/password
  certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
```

Note that you must supply a password. Empty passwords are not supported.

The action makes the keychain the default keychain on the system. You can disable this as shown below.

```yml
name: Install Certificate
uses: ./.actions/install-certificate
with:
  password-op-reference: op://My Vault/My Certificate/password
  certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
  set-default-keychain: false
```

You may optionally specify the name of the keychain to install the certificate and the password of that keychain.

```yml
name: Install Certificate
uses: ./.actions/install-certificate
with:
  password-op-reference: op://My Vault/My Certificate/password
  certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
  keychain-name: signing.keychain
  keychain-password: h3ll0w0rld
```

## [install-ci-ssh-key](https://github.com/shapehq/actions/blob/main/install-ci-ssh-key/action.yml)

Install the CI's SSH key.

```yml
name: Install CI SSH Key
uses: ./.actions/install-ci-ssh-key
```

You may optionally specify the name of the file to store the SSH key in. Only do this if you are storing multiple SSH keys to avoid overriding an SSH key.

```yml
name: Install CI SSH Key
uses: ./.actions/install-ci-ssh-key
with:
  filename: ci
```

Use the [install-ssh-key](https://github.com/shapehq/actions/edit/main/README.md#install-ssh-key) action to install a specified SSH key.

## [install-enterprise-distribution-certificate](https://github.com/shapehq/actions/blob/main/install-enterprise-distribution-certificate/action.yml)

Installs Shape's default enterprise distribution certificate in the keychain.

```yml
name: Install Enterprise Distribution Certificate
uses: ./.actions/install-enterprise-distribution-certificate
```

The action makes the keychain the default keychain on the system. You can disable this as shown below.

```yml
name: Install Enterprise Distribution Certificate
uses: ./.actions/install-enterprise-distribution-certificate
with:
  set-default-keychain: false
```

You may optionally specify the name of the keychain to install the certificate and the password of that keychain.

```yml
name: Install Enterprise Distribution Certificate
uses: ./.actions/install-enterprise-distribution-certificate
with:
  keychain-name: signing.keychain
  keychain-password: h3ll0w0rld
```

Use the [install-certificate](https://github.com/shapehq/actions/edit/main/README.md#install-certificate) action to install a specified certificate.

## [install-enterprise-distribution-provisioning-profile](https://github.com/shapehq/actions/blob/main/install-enterprise-distribution-provisioning-profile/action.yml)

Installs Shape's default provisioning profile for enterprise distribution.

```yml
name: Install Enterprise Distribution Provisioning Profile
uses: ./.actions/install-enterprise-distribution-provisioning-profile
```

If you are using custom entitlements in your app or you are building an app for distribution on the App Store, you will likely need to install a specific provisioning profile. Refer to the [install-provisioning-profile](https://github.com/shapehq/actions/edit/main/README.md#install-provisioning-profile) action for installing a specified provisioning profile.

## [install-provisioning-profile](https://github.com/shapehq/actions/blob/main/install-provisioning-profile/action.yml)

Installs a provisioning profile.

```yml
name: Install Provisioning Profile
uses: ./.actions/install-provisioning-profile
with:
  op-reference: op://My Vault/My Provisioning Profile/profile.mobileprovision
```

## [install-shipshape](https://github.com/shapehq/actions/blob/main/install-shipshape/action.yml)

Installs Shipshape and sets an activation code.

```yml
name: Install Shipshape
uses: ./.actions/install-shipshape
```

You may optionally specify an activation code to be used by Shipshape. You will likely want to use the default activation code though.

```yml
name: Install CI SSH Key
uses: ./.actions/install-shipshape
with:
  op-reference: op://My Vault/My Shipshape Activation Code/password
```

## [install-ssh-key](https://github.com/shapehq/actions/tree/main/install-ssh-key)

Installs an SSH key.

```yml
name: Install SSH Key
uses: ./.actions/install-ssh-key
with:
  op-reference: op://My Vault/My SSH Key/ssh-key
```

You may optionally specify the name of the file to store the SSH key in. Only do this if you are storing multiple SSH keys to avoid overriding an SSH key.

```yml
name: Install SSH Key
uses: ./.actions/install-ssh-key
with:
  op-reference: op://My Vault/My SSH Key/ssh-key
  filename: my_key
```
