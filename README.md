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
- improves deliveries messages on GitHub

## How to use

1. Create a new webhook (with an application) on Discord and keep the url / token + id
1. Go to your repository or user / organization settings on GitHub and create a new webhook with the events you want to send. The url is the url of the server you are running the application on.
1. Deploy the code with your rules on the server*.

\* Can either be on the [website](https://ghostrider-05.github.io/github-discord-events/) or self hosted on a VPS server (node v18 or higher) or serverless platform like Cloudflare Workers.

## Documentation & Examples

- [Documentation](https://ghostrider-05.github.io/github-discord-events/)
- [Examples](https://ghostrider-05.github.io/github-discord-events/examples/)
