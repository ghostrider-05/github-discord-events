---
home: true
tagline: Customize your GitHub webhook messages to Discord
actions:
    - text: Get started
      link: ./guide/installing
      type: primary
    - text: Reference
      link: ./reference
      type: secondary
features:
    - title: Highly customisable
      details: Send webhooks in threads / forums, with messages, mentions, components and more!
    - title: Typescript
      details: Enjoy the features of Typescript with typed payloads, methods, etc.
    - title: More Events
      details: Send more GitHub webhook events to your Discord channel
    - title: Minimal setup
      details: Easily to deploy with few code lines needed. Start your webhooks in about 30 lines of code
    - title: Filter by rules
      details: Add new rules and control events by their labels, milestone, actions, branch and more!
    - title: Lifecycle hooks
      details: Listen to lifecycle hooks and easily integrate events into your Discord bot
footer: Created by ghostrider-05 | All rights reserved
---

## Example

Create a message in a Discord channel when a new release is published.

### Discord

<DiscordMessages>
	<DiscordMessage :bot="true" author="GitHub" :avatar="avatar">
		<template #embeds>
            <DiscordEmbed
                authorName="ghostrider-05"
                embedTitle="[ghostrider-05/github-discord-events] New release published: 2.1.0"
                url="https://github.com/ghostrider-05/github-discord-events/releases/tag/2.1.0"
            >
            </DiscordEmbed>
        </template>
        <DiscordMention type='role' :highlight="true" roleColor="#00FF00">releases</DiscordMention> 
        version 2.1.0 is out!
        <DiscordMarkdown>
        <br><br>
        View the changelog: https://github.com/ghostrider-05/github-discord-events/blob/master/CHANGELOG.md#2.1.0.
        </DiscordMarkdown>
	</DiscordMessage>
</DiscordMessages>

### Code

```ts
import { RuleBuilder, GitHubEventManager } from 'github-discord-events'

const rules = new RuleBuilder({ webhook: WEBHOOK_URL })
    .addEvent({
        name: 'release',
        actions: ['published'],
        main: false,
        addFilter: (event) => {
            return !event.release.draft // Ignore draft releases
        },
        transformMessage: (event, embeds) => {
            const { tag_name } = event.release
            const changelog = `https://github.com/ghostrider-05/github-discord-events/blob/master/CHANGELOG.md#${tag_name}`

            const content = `<@role_id> version ${tag_name} is out!\n\nView the changelog: ${changelog}.`
            return {
                embeds,
                content
            }
        }
    })

const manager = new GitHubEventManager({ rules })

addEventListener('fetch', event => {
    event.respondWith(manager.handleEvent(event.request))
})
```

<script setup>
import '@discord-message-components/vue/dist/style.css'

const avatar = "https://cdn.discordapp.com/avatars/858851908721967105/df91181b3f1cf0ef1592fbe18e0962d7.webp?size=100"
</script>
