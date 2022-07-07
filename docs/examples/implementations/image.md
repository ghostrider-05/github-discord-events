# Issue image

```js
import { 
    GitHubEventManager, 
    DiscordWebhookEmbed, 
    RuleBuilder 
} from 'github-discord-events'

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

const manager = new GitHubEventManager({
    rules
})

addEventListener('fetch', event => {
    event.respondWith(manager.handleEvent(event.request))
})
```
