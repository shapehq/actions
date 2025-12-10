# OpenAPI Diff

Runs [oasdiff](https://github.com/tufin/oasdiff) changelog between two OpenAPI specs and outputs the differences with nice formatting for GitHub PR comments.

## Usage

```yaml
- name: Diff OpenAPI Specs
  id: oasdiff
  uses: shapehq/actions/oasdiff@main
  with:
    base: path/to/base-spec.yml
    head: path/to/head-spec.yml

- name: Show diff
  run: echo "${{ steps.oasdiff.outputs.diff }}"
```

### With PR Comments

A common pattern is to show API changes in pull request comments:

```yaml
name: OpenAPI Diff

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  oasdiff:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout PR branch
        uses: actions/checkout@v4
        with:
          path: pr

      - name: Checkout base branch
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.base.ref }}
          path: base

      - name: Diff API
        id: diff
        uses: shapehq/actions/oasdiff@main
        with:
          base: base/openapi.yml
          head: pr/openapi.yml

      - name: Build comment
        run: |
          cat > comment.md << 'EOF'
          ## OpenAPI Diff Report

          ${{ steps.diff.outputs.diff }}

          ---
          *Updated for commit ${{ github.event.pull_request.head.sha }}*
          EOF

      - name: Post PR comment
        uses: shapehq/actions/create-or-update-pr-comment@main
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          body-file: comment.md
          update-marker: oasdiff-report
```

### Multiple API Specs

For projects with multiple OpenAPI specs:

```yaml
- name: Diff Invoicing API
  id: diff-invoicing
  uses: shapehq/actions/oasdiff@main
  with:
    base: base/invoicing-api.yml
    head: pr/invoicing-api.yml

- name: Diff Reporting API
  id: diff-reporting
  uses: shapehq/actions/oasdiff@main
  with:
    base: base/reporting-api.yml
    head: pr/reporting-api.yml

- name: Build comment
  run: |
    cat > comment.md << 'EOF'
    ## OpenAPI Diff Report

    ### Invoicing API
    ${{ steps.diff-invoicing.outputs.diff }}

    ### Reporting API
    ${{ steps.diff-reporting.outputs.diff }}
    EOF
```

## Inputs

| Name     | Description                                                         | Required | Default  |
| -------- | ------------------------------------------------------------------- | -------- | -------- |
| `base`   | Path to the base OpenAPI spec file                                  | Yes      |          |
| `head`   | Path to the head OpenAPI spec file                                  | Yes      |          |
| `format` | Output format: `markup`, `text`, `html`, or `json`                  | No       | `markup` |

## Outputs

| Name          | Description                                |
| ------------- | ------------------------------------------ |
| `diff`        | The formatted diff output                  |
| `has-changes` | Whether there are changes (`true`/`false`) |

## Output Formats

- **markup**: GitHub-flavored markdown with :warning: emojis for breaking changes (default). Renders beautifully in PR comments.
- **text**: Plain text changelog output
- **html**: Full HTML with styling (useful for standalone pages)
- **json**: JSON format for programmatic processing

## Example Output

With the default `markup` format, the output looks like this in PR comments:

---

### GET /api/users/consent
- :warning: removed the required property 'emailAccepted' from the response with the '200' status
- added the new optional 'query' request parameter 'filter'

### POST /api/users
- added the new optional request property 'nickname'

---

Breaking changes are clearly marked with :warning: emojis.
