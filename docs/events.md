
# Events

## Default events

> This list will be shown until all events are supported.
If an event is not yet supported, you can add an event rule to send messages.

| Name                           | Supported |
| ------------------------------ | --------- |
| branch_protection_rule         | x         |
| check_run                      | x         |
| check_suite                    | x         |
| code_scanning_alert            | x         |
| commit_comment                 | x         |
| create                         | x         |
| delete                         | x         |
| deploy_key                     | x         |
| deployment                     | x         |
| deployment_status              | x         |
| discussion                     | x         |
| discussion_comment             | x         |
| fork                           | x         |
| github_app_authorization*      | -         |
| gollum                         | x         |
| installation*                  | -         |
| installation_repositories*     | -         |
| issue_comment                  | x         |
| issues                         | x         |
| label                          |           |
| marketplace_purchase*          | -         |
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
| public                         | x         |
| pull_request                   | x         |
| pull_request_review            |           |
| pull_request_review_comment    | x         |
| pull_request_review_thread     | x         |
| push                           | x         |
| release                        | x         |
| repository                     | x         |
| repository_dispatch*           | -         |
| repository_import              | x         |
| repository_vulnerability_alert | x         |
| secret_scanning_alert***       | -         |
| security_advisory*             | -         |
| sponsorship**                  | x         |
| star                           | x         |
| status                         | x         |
| team                           | x         |
| team_add                       | x         |
| watch                          | x         |
| workflow_dispatch*             | -         |
| workflow_job                   | x         |
| workflow_run*                  | -         |

* These events are only sent to GitHub apps
** Requires it's own webhook
*** This event is missing GitHub documentation

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
