
# Events

## Default events

> This list will be shown until all events are supported.
If an event is not yet supported, you can add an event rule to send messages.

| Name                           | Supported |
| ------------------------------ | --------- |
| branch_protection_rule         |           |
| check_run                      |           |
| check_suite                    |           |
| code_scanning_alert            |           |
| commit_comment                 | x         |
| create                         | x         |
| delete                         | x         |
| deploy_key                     |           |
| deployment                     |           |
| deployment_status              |           |
| discussion                     | x         |
| discussion_comment             | x         |
| fork                           | x         |
| github_app_authorization       |           |
| gollum                         |           |
| installation                   |           |
| installation_repositories      |           |
| issue_comment                  | x         |
| issues                         | x         |
| label                          |           |
| marketplace_purchase           |           |
| member                         |           |
| membership                     |           |
| meta                           |           |
| milestone                      |           |
| org_block                      |           |
| organization                   |           |
| package                        |           |
| page_build                     |           |
| ping                           | x         |
| project                        |           |
| project_card                   |           |
| project_column                 |           |
| public                         |           |
| pull_request                   | x         |
| pull_request_review            |           |
| pull_request_review_comment    | x         |
| pull_request_review_thread     | x         |
| push                           | x         |
| release                        | x         |
| repository                     |           |
| repository_dispatch            |           |
| repository_import              |           |
| repository_vulnerability_alert |           |
| secret_scanning_alert          |           |
| security_advisory              |           |
| sponsorship                    |           |
| star                           | x         |
| status                         |           |
| team                           |           |
| team_add                       |           |
| watch                          |           |
| workflow_dispatch              |           |
| workflow_job                   |           |
| workflow_run                   |           |

## Discord events

> The `emittedEvents` object is also exported with all the information in this table.

| Name                        | Actions                  |
| --------------------------- | ------------------------ |
| commit_comment              | *                        |
| create                      | *                        |
| delete                      | *                        |
| discussion                  | answered, created        |
| discussion_comment          | created                  |
| fork                        | *                        |
| issues                      | reopened, opened, closed |
| issue_comment               | created                  |
| pull_request                | opened, closed, reopened |
| pull_request_review         | submitted, dismissed     |
| pull_request_review_comment | created                  |
| push                        | *                        |
| release                     | published                |
| star                        | created                  |
