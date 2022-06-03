# Hosted / self hosted

- For how to deploy your own code, skip to the [self hosted](#self-hosted) section

## Website

> **Warning**
> The website and API is not publicly available / built yet

You can manage your webhooks on [the website]() by filling in the form.

### API

#### Base URL

```txt:no-line-numbers
https://github-rules.ghostrider.workers.dev/api/v{api_version}
```

#### Version

| Version | Status    |
| ------- | --------- |
| 1       | Available |

#### POST `/`

Create a new webhook. Returns `200` with a new id on success.

JSON Params

| Name  | type                   | Required |
| ----- | ---------------------- | -------- |
| rules | GitHubEventRulesConfig | true     |

#### GET `/`

Query Params

| Name | type   | Required |
| ---- | ------ | -------- |
| id   | string | true     |

#### DELETE `/`

Query Params

| Name | type   | Required |
| ---- | ------ | -------- |
| id   | string | true     |

## Self hosted

// Add guide

### Serverless

:::tip Platforms
This guide is suitable for most platforms, including:

- CF workers
- Vercel

:::

### Node.js
