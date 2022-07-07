---
next: getting-started 
---

# Introduction

This package is an easy, but highly configurable, way to customize your GitHub webhook messages to Discord.

## Why?

Why a(nother) package to send webhooks? The `/github` appendix to the Discord webhook url can already send webhooks and packages like [`gitcord`](https://www.npmjs.com/package/gitcord) also uses GitHub event payloads.

### Why not Discord's solution?

- can send events that are not delivered to Discord (e.g. pinned issue event)
- specify the channel, thread, saturation color and more based on the event
- allows to further customize message with a message, components and more

### Why not another package?

- sends the same default message as the `/github` webhook **without any configuration**
- easily filter events based on their payload (branch, milestone, labels, etc.) with rules
- hosted solution or handle requests self hosted (without a token)
- typed webhook payloads for every incoming event
- improves deliveries messages on GitHub
- no dependencies
