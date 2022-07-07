---
prev: 
    text: Webhook events
    link: events
next: 
    text: Advanced - Discord API
    link: ./advanced/discord-api
---

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
| 0       | Available |

#### POST `/`

Create a new webhook. Returns `200` with a new id on success. Then in GitHub the `/:id/github` route can be used for webhook events.

JSON Params

| Name  | type                                                                                 | Required |
| ----- | ------------------------------------------------------------------------------------ | -------- |
| rules | [GitHubEventRawRulesConfig](./reference/type_aliases/githubeventrawrulesconfig.html) | true     |

#### GET `/:id/rules`

Get the rules for an event manager

#### GET `/:id/webhooks`

Get the registered webhooks for an event manager

#### POST `/:id/webhooks/validate`

Validate the registered webhooks. Returns `200` with the webhooks that passed the validation

Params

| Position | Name    | type   | Required | Description                                              |
| -------- | ------- | ------ | -------- | -------------------------------------------------------- |
| Query    | version | number | false    | Only pass webhooks using this version of the Discord API |

Example result

```json
{
    "passed": [
        "https://discord.com/api/v10/webhooks/id/token"
    ],
    "failed": []
}
```

#### POST `/webhooks/validate`

Validate a Discord webhook

| Position | Name              | Type   | Required | Description                 |
| -------- | ----------------- | ------ | -------- | --------------------------- |
| Headers  | X-Discord-Webhook | string | true     | The webhook url to validate |

Returns `204` when the webhook is correctly validated

#### DELETE `/:id/`

Delete an event manager with all associated rules and webhooks. Returns `200` with the deleted rules and webhooks.

Example result

```json
{
    "rules": {
        "webhook": { 
            "url": "https://discord.com/api/v10/id/token"
        },
        "actions": ["reopened"],
        "events": [
            {
                "name": "issues",
                "webhook": {
                    "id": "random_id",
                    "token": "token"
                },
                "main": false
            }
        ]
    },
    "webhooks": [
        "https://discord.com/api/v10/id/token",
        "https://discord.com/api/v10/random_id/token"
    ]
}
```

## Self hosted

This package will work out of the box on any platform with:

- `Response` and `Request` implementations
- native `fetch` function

:::tip Platform examples
Serverless, including:

- CF workers
- Vercel

Node.js:
[Version 17.5+](https://nodejs.org/docs/latest-v18.x/api/globals.html#fetch)

:::

### Node.js 17.5-

If you are running code on your server with Node.js 17.4 or lower or with the [`--no-experimental-fetch`](https://nodejs.org/docs/latest-v18.x/api/cli.html#--no-experimental-fetch) flag, you will need to add support for `fetch`.

```sh
npm install node-fetch
```

After installing `node-fetch`, add a new script that will update this package:

```js
// ./scripts/adapt.js
import { resolve } from 'path'
import * as fs from 'fs'

const files = [
    'discord/webhook.d.ts', 
    'discord/webhook.js'
]
const dir = './node_modules/github-discord-events/'

const options = { encoding: 'utf8' }
const importFetch = `import fetch from 'node-fetch'`

files.forEach(file => {
    const path = resolve('.', dir + file)
    const content = `${importFetch}\n${fs.readFileSync(path, options)}`

    fs.writeFileSync(path, content, options)
})
```

Every time you update `github-discord-events`, run `node ./scripts/adapts.js` to implement the correct `fetch` implementation.
