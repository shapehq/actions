## [normalize-github-file-links](https://github.com/shapehq/actions/blob/main/normalize-github-file-links/action.yml)

Rewrites local workspace file links in markdown to GitHub blob links for a target branch.

```yml
- name: Normalize markdown file links
  id: normalize_links
  uses: shapehq/actions/normalize-github-file-links@v1
  with:
    markdown: ${{ steps.run_codex.outputs.final-message }}
    branch-name: ${{ github.head_ref }}
```

The action has the following inputs:

| Name          | Required | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| `markdown`    | Yes      | Markdown content whose local file links should be normalized |
| `branch-name` | Yes      | Git branch used in generated GitHub blob links               |

The action has the following outputs:

| Name       | Description                 |
| ---------- | --------------------------- |
| `markdown` | The normalized markdown content |
