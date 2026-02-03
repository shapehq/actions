## [create-or-update-pr-comment](https://github.com/shapehq/actions/blob/main/create-or-update-pr-comment/action.yml)

Creates (or updates if already exis) a PR comment. Always updates the same comment by default using a hidden marker. If you need to create more than one comment, you need to pass different markers as a parameter.

The action has the following inputs:

| Name          | Description                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| token\*       | GitHub token with issues:write permission. Usually `secrets.GITHUB_TOKEN`.                                            |
| body-file\*   | A path to a local Markdown file containing the contents of the comment.                                               |
| pr-number     | Pull request number; auto-detected on PR events if omitted. (Optional)                                                |
| update-marker | Stable marker token used to find/update the comment. Can be used to have multiple comments in the same PR. (Optional) |

and the following outputs:

| Name        | Description                          |
| ----------- | ------------------------------------ |
| comment-id  | ID of the resulting comment          |
| comment-url | URL linking to the resulting comment |

Example usage:

```yml
- name: Prepare body comment
  id: prep-comment
  shell: bash
  run: |
    COMMENT_FILE="$RUNNER_TEMP/comment.md"
    echo "## Hello World!" > "$COMMENT_FILE"
    echo "comment_file=$COMMENT_FILE" >> "$GITHUB_OUTPUT"

- name: Create or update comment
  id: comment
  uses: shapehq/actions/create-or-update-pr-comment@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    body-file: ${{ steps.prep-comment.outputs.comment_file }}
```