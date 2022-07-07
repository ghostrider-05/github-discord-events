# Discord API Integration

## Rate limits

## Interaction components

A workaround to add components (buttons, modals, etc.) is to create an application webhook (see [the Discord documentation](https://discord.com/developers/docs/resources/webhook#execute-webhook-jsonform-params)). Then this application webhook is able to create messages with components.

```ts
// bot.ts
import { Client } from 'discord.js'

const client = new Client({ intents })
const channelId = 'channel_id'

// For these examples the Discord.js Client will be used.
client.once('ready', () => {
    // If the application webhook is already defined, return
    if (process.env.WEBHOOK_URL) return

    // Create a new application webhook in the channel
    const channel = client.guilds.cache.get('guild_id').channels.cache.get(channelId)
    const webhook = await channel.createWebhook({
        name: 'GitHubDiscord'
    })
    
    // Store the url / id in a .env file
    console.log(webhook?.url, webhook?.id)
})

client.login()

```

After the webhook is created, [the server can be started](../hosted.md) on your platform of choice

```ts
// server/index.ts

import { GitHubRulesManager, RuleBuilder } from 'github-discord-events'

// Use the application webhook
const rules = new RuleBuilder({ url: process.env.WEBHOOK_URL! })
    .setFilter('transformMessage', (event, embeds) => {
        return {
            embeds,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            url: 'https://github.com/org/repo/path_release_assets.zip',
                            label: 'Download release'
                        },
                        {
                            type: 2,
                            style: 1,
                            custom_id: 'release-changelog:{repo}/{tag}',
                            label: 'View changelog'
                        }
                    ]
                }
            ]
        }
    })
    .setFilter('onBeforeActivated', async ({ message }, { payload }) => {
        // Before posting the release in Discord, also post it to Reddit
        await fetch('https://reddit.com/api/submit', {
            method: 'POST',
            body: JSON.stringify({
                url: payload.release.html_url,
                kind: 'url',
                resubmit: true,
                title: message.embeds[0].title,
                sr: 'hello_world' // The name of the subreddit
            }),
            headers
        })
    })

const manager = new GitHubRulesManager({ rules })

addEventListener('fetch', event => {
    event.respondWith(manager.handleEvent(event.request))
})
```
