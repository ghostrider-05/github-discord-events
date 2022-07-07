# Star counting

```js
import { 
    GitHubEventManager, 
    DiscordWebhookEmbed, 
    RuleBuilder 
} from 'github-discord-events'

const rules = new RuleBuilder({ url: 'webhook_url' })
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
