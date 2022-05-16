# Github -> Discord webhook

Package to customize your GitHub webhook messages to Discord.

## Why?

Why a(nother) package to send webhooks? The `/github` appendix to the Discord webhook url can already send webhooks and packages like [`gitcord`](https://www.npmjs.com/package/gitcord) also uses GitHub event payloads.

Why not Discord's solution?

- can send events that are not delivered to Discord (e.g. pinned issue event)
- specify the channel, thread, saturation color and more based on the event
- allows to further customize message with a message, components and more

Why not another package?

- sends the same default message as the `/github` webhook **without any configuration**
- easily filter events based on their payload (branch, milestone, labels, etc.) with rules
- hosted solution or handle requests self hosted (without a token)
- typed webhook payloads for every incoming event

## How to use

1. Create a new webhook (with an application) on Discord and keep the url / token + id
1. Go to your repository or user / organization settings on GitHub and create a new webhook with the events you want to send. The url is the url of the server you are running the application on.
1. Deploy the code with your rules on the server*.

\* Can either be on the [website]() or self hosted on a VPS server (node v18 or higher) or serverless platform like Cloudflare Workers.

## Examples

<details>
<summary>Cloudflare Worker</summary>

```js
import { GitHubEventManager, DiscordWebhookEmbed, RuleBuilder } from 'github-discord-events'

const rules = new RuleBuilder({ url: 'webhook_url' })
    .addEvent({
        name: 'issues',
        actions: ['opened'],
        // Adds an image to the embed on a new commit
        transformEmbed: (event, embeds) => {
            const { repository, issue } = event
            const image = DiscordWebhookEmbed.embedImage(
                `${repository.full_name}/issues/${issue.number}`
            )

            const embed = embeds?.[0] ?? {}

            return [{
                image: {
                    url: image
                },
                ...embed
            }]
        },
        // Only apply it on the main branch
        branches: ['main']
    })
    .addEvent({
        name: 'star',
        actions: ['created'],
        threadId: '0123', // A star counting thread
        transformMessage: ({ repository }) => {
            const stars = repository.stargazers_count

            const content = stars % 1000 === 0
                ? `@here We reached ${stars} stars!`
                : `${stars} stars`

            return {
                content
            }
        }
    })

const manager = new GitHubEventManager({
    rules
})

addEventListener('fetch', event => {
    event.respondWith(manager.handleEvent(event.request))
})
```

</details>

<!-- <details>
<summary>Node.js VPS</summary>

```ts
import { Client, Intents } from 'discord.js'
import { GithubEventManager, DiscordWebhookEmbed, createEventRule } from 'github-discord-events'
import express from 'express'

const client = new Client({
    intents: [
        Intents.GUILDS,
        Intents.GUILD_MESSAGES
    ]
})

const manager = new GithubEventManager({
    rules: {
        webhook: {
            url: 'webhook_url'
        },
        events: [
            createEventRule({
                name: 'discussion',
                actions: ['created'],
                transformMessage: (event, embed) => {
                    return {
                        content: `<@1234567890> A new discussion has started:`,
                        embeds: [embed]
                    }
                }
            })
        ]
    }
})

const app = express()

app.get('/webhook', async (req, res) => {
    const response = await manager.handleEvent(req)

    res.sendStatus(response.status)
})

client.on('messageCreate', (msg) => {
    if (msg.webhookId === 'webhook_id') {
        msg.startThread({
            name: msg.embeds[0].title ?? 'New discussion'
        })
    }
})

client.login()
```

</details> -->
