# Actions

This repository contains actions to be used with [GitHub Actions](https://github.com/features/actions) internally at Shape. Please refer to [this article](https://shapedk.atlassian.net/wiki/spaces/SHAPE/pages/3640262736/GitHub+Actions+Runners) for the details on getting started with our self-hosted GitHub Actions runner.

## Getting Started

Several of these actions depend on the 1Password CLI being installed. Please use the [install-op-cli](https://github.com/simonbs/install-op-cli) action to install the 1Password CLI.

## [install-appiconannotator](https://github.com/shapehq/actions/blob/main/install-appiconannotator/action.yml)

Installs [appiconannotator](https://github.com/shapehq/appiconannotator).

```yml
name: Install appiconannotator
uses: shapehq/actions/install-appiconannotator@main
```

## [install-artifactory-profile](https://github.com/shapehq/actions/blob/main/install-artifactory-profile/action.yml)

Installs a [JFrog Artifactory](https://artifactory.shapeapp.dk/) profile with read access to internal artifacts.

```yml
name: Install JFrog Artifactory profile
uses: shapehq/actions/install-artifactory-profile@main
```

## [install-certificate](https://github.com/shapehq/actions/blob/main/install-certificate/action.yml)

Installs the specified certificate in the keychain.

```yml
name: Install Certificate
uses: shapehq/actions/install-certificate@main
with:
  password-op-reference: op://My Vault/My Certificate/password
  certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
```

Note that you must supply a password. Empty passwords are not supported.

The action makes the keychain the default keychain on the system. You can disable this as shown below.

```yml
name: Install Certificate
uses: shapehq/actions/install-certificate@main
with:
  password-op-reference: op://My Vault/My Certificate/password
  certificate-op-reference: op://My Vault/My Certificate/Certificate.p12
  set-default-keychain: false
```

You may optionally specify the name of the keychain to install the certificate and the password of that keychain.

```yml
name: Install Certificate
uses: shapehq/actions/install-certificate@main
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
uses: shapehq/actions/install-ci-ssh-key@main
```

You may optionally specify the name of the file to store the SSH key in. Only do this if you are storing multiple SSH keys to avoid overriding an SSH key.

```yml
name: Install CI SSH Key
uses: shapehq/actions/install-ci-ssh-key@main
with:
  filename: ci
```

Use the [install-ssh-key](https://github.com/shapehq/actions/edit/main/README.md#install-ssh-key) action to install a specified SSH key.

## [install-enterprise-distribution-certificate](https://github.com/shapehq/actions/blob/main/install-enterprise-distribution-certificate/action.yml)

Installs Shape's default enterprise distribution certificate in the keychain.

```yml
name: Install Enterprise Distribution Certificate
uses: shapehq/actions/install-enterprise-distribution-certificate@main
```

The action makes the keychain the default keychain on the system. You can disable this as shown below.

```yml
name: Install Enterprise Distribution Certificate
uses: shapehq/actions/install-enterprise-distribution-certificate@main
with:
  set-default-keychain: false
```

You may optionally specify the name of the keychain to install the certificate and the password of that keychain.

```yml
name: Install Enterprise Distribution Certificate
uses: shapehq/actions/install-enterprise-distribution-certificate@main
with:
  keychain-name: signing.keychain
  keychain-password: h3ll0w0rld
```

Use the [install-certificate](https://github.com/shapehq/actions/edit/main/README.md#install-certificate) action to install a specified certificate.

## [install-enterprise-distribution-provisioning-profile](https://github.com/shapehq/actions/blob/main/install-enterprise-distribution-provisioning-profile/action.yml)

Installs Shape's default provisioning profile for enterprise distribution.

```yml
name: Install Enterprise Distribution Provisioning Profile
uses: shapehq/actions/install-enterprise-distribution-provisioning-profile@main
```

If you are using custom entitlements in your app or you are building an app for distribution on the App Store, you will likely need to install a specific provisioning profile. Refer to the [install-provisioning-profile](https://github.com/shapehq/actions/edit/main/README.md#install-provisioning-profile) action for installing a specified provisioning profile.

## [install-provisioning-profile](https://github.com/shapehq/actions/blob/main/install-provisioning-profile/action.yml)

Installs a provisioning profile.

```yml
name: Install Provisioning Profile
uses: shapehq/actions/install-provisioning-profile@main
with:
  op-reference: op://My Vault/My Provisioning Profile/profile.mobileprovision
```

## [install-shipshape](https://github.com/shapehq/actions/blob/main/install-shipshape/action.yml)

Installs Shipshape and sets an activation code.

```yml
name: Install Shipshape
uses: shapehq/actions/install-shipshape@main
```

You may optionally specify an activation code to be used by Shipshape. You will likely want to use the default activation code though.

```yml
name: Install CI SSH Key
uses: shapehq/actions/install-shipshape@main
with:
  op-reference: op://My Vault/My Shipshape Activation Code/password
```

## [install-ssh-key](https://github.com/shapehq/actions/tree/main/install-ssh-key/action.yml)

Installs an SSH key.

```yml
name: Install SSH Key
uses: shapehq/actions/install-ssh-key@main
with:
  op-reference: op://My Vault/My SSH Key/ssh-key
```

You may optionally specify the name of the file to store the SSH key in. Only do this if you are storing multiple SSH keys to avoid overriding an SSH key.

```yml
name: Install SSH Key
uses: shapehq/actions/install-ssh-key@main
with:
  op-reference: op://My Vault/My SSH Key/ssh-key
  filename: my_key
```

## [post-slack-message](https://github.com/shapehq/actions/tree/main/post-slack-message/action.yml)

Posts a message to Slack.

```yml
name: Post to Slack
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
name: Post failure to Slack
if: ${{ failure() }}
uses: shapehq/actions/post-slack-message@main
with:
  channel: "#my-channel"
  message: "Project X build for App Store failed 💥"
  op-slack-token-reference: op://My Vault/My Slack Token/token
```

## [xcode-select](https://github.com/shapehq/actions/tree/main/xcode-select)

Selects a version of Xcode.

The following will pin against the major version only, so the action may select version 14.0, 14.3, or 14.3.1.

```yaml
name: Select Xcode Version
uses: shapehq/actions/xcode-select@main
with:
  version: 14
```

The following will pin against the major and minor version, so the action may select Xcode 14.3 or Xcode 14.3.1.

```yaml
name: Select Xcode Version
uses: shapehq/actions/xcode-select@main
with:
  version: 14.3
```

The following will pin against an exact version of Xcode and will not select any other version than the one specified.

```yaml
name: Select Xcode Version
uses: shapehq/actions/xcode-select@main
with:
  version: 14.3.1
```
