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

Use the [install-certificate](https://github.com/shapehq/actions?tab=readme-ov-file#install-certificate) action to install a specified certificate.