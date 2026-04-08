## [get-linked-issue-node-ids](https://github.com/shapehq/actions/blob/main/get-linked-issue-node-ids/action.yml)

Resolves the issue node IDs linked from a pull request via closing references.

```yml
- name: Resolve linked issues
  id: linked_issues
  uses: shapehq/actions/get-linked-issue-node-ids@v1
  with:
    github-token: ${{ github.token }}
    repository-owner: ${{ github.repository_owner }}
    repository-name: ${{ github.event.repository.name }}
    pull-request-number: ${{ github.event.pull_request.number }}
```

The action has the following inputs:

| Name                  | Required | Description                            |
| --------------------- | -------- | -------------------------------------- |
| `github-token`        | Yes      | Token used to query the pull request   |
| `repository-owner`    | Yes      | Repository owner login                 |
| `repository-name`     | Yes      | Repository name                        |
| `pull-request-number` | Yes      | Pull request number                    |

The action has the following outputs:

| Name             | Description                            |
| ---------------- | -------------------------------------- |
| `issue-node-ids` | Newline-separated linked issue node IDs |

The token used by this action must be able to read the target pull request and its linked issues.
