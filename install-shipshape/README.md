## [install-shipshape](https://github.com/shapehq/actions/blob/main/install-shipshape/action.yml)

Installs Shipshape and sets an activation code.

```yml
- name: Install Shipshape
  uses: shapehq/actions/install-shipshape@v1
  with:
    activation-code: ${{ secrets.SHIPSHAPE_ACTIVATION_CODE }}
```
