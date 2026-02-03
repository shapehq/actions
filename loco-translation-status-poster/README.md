## [loco-translation-status-poster](https://github.com/shapehq/actions/tree/main/loco-translation-status-poster/action.yml)

Checks if there are missing translations in the Localize.biz project and posts warning to Slack.

```yml
- name: Verify Loco Translations and Post to Slack
  uses: shapehq/actions/loco-translation-status-poster@v1
  with:
    channel: "#my-channel"
    op-slack-token-reference: op://My Vault/My Slack Token/token
    op-loco-api-key-reference: op://My Vault/My Loco API Key/key
```