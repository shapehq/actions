## [set-project-status](https://github.com/shapehq/actions/blob/main/set-project-status/action.yml)

Adds GitHub issues or pull requests to a Project v2 and sets their single-select status field.

```yml
- name: Move issue to In progress
  id: move_issue
  uses: shapehq/actions/set-project-status@v1
  with:
    github-token: ${{ steps.projects_token.outputs.token }}
    project-owner: shapehq
    project-number: 14
    status-name: In progress
    content-node-ids: ${{ github.event.issue.node_id }}
```

The action has the following inputs:

| Name                 | Required | Default    | Description                                                           |
| -------------------- | -------- | ---------- | --------------------------------------------------------------------- |
| `github-token`       | Yes      |            | Token with permission to read and write the target GitHub Project v2  |
| `project-owner`      | Yes      |            | User or organization login that owns the project                      |
| `project-number`     | Yes      |            | Project number from the project URL                                   |
| `status-field-name`  | No       | `Status`   | Name of the single-select field to update                             |
| `status-name`        | No       |            | Fallback single-select option name to set                             |
| `status-name-map`    | No       | `{}`       | JSON object mapping content node IDs to target status names           |
| `content-node-ids`   | Yes      |            | Comma, space, or newline separated issue or pull request node IDs     |
| `add-if-missing`     | No       | `true`     | Adds content to the project when not already present                  |
| `on-missing-project` | No       | `fail`     | Whether a missing project should fail or warn                         |
| `on-missing-field`   | No       | `fail`     | Whether a missing status field should fail or warn                    |
| `on-missing-option`  | No       | `fail`     | Whether a missing target status option should fail or warn            |

The action has the following outputs:

| Name                       | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| `previous-statuses`        | JSON object mapping content node IDs to their prior status names |
| `applied-statuses`         | JSON object mapping content node IDs to the applied status names |
| `skipped-content-node-ids` | Newline-separated content node IDs skipped by the action         |

Example of restoring prior statuses if a later workflow step fails:

```yml
- name: Restore prior status
  if: failure() && steps.move_issue.outputs.previous-statuses != ''
  uses: shapehq/actions/set-project-status@v1
  with:
    github-token: ${{ steps.projects_token.outputs.token }}
    project-owner: shapehq
    project-number: 14
    status-name-map: ${{ steps.move_issue.outputs.previous-statuses }}
    content-node-ids: ${{ github.event.issue.node_id }}
```

The token used by this action should have:

- Organization `Projects` permission with `read` and `write`
- Repository access to the target issue or pull request
- Repository `Issues` permission with at least `read`
- Repository `Pull requests` permission with at least `read`

`project-owner` is assumed to be an organization login.
