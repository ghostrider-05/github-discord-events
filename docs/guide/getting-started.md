---
prev: introduction
next: 
    text: Configuration
    link: configuration
---

# Getting started

## Prerequisites

- http/https server: to handle incoming request you will need a server that can receive requests (e.g. serverless worker, node.js VPS). See for more details [the deploying guide](hosted.md#self-hosted)

## New project

This section will explain all the steps to create a project.

1. [Create a new Discord Webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) (or multiple webhooks) in the channel(s) you want the messages to send and copy it's URL.
2. Build your rules manager and deploy it to your server. See [the examples](../examples/) for code ideas and [the deploying guide](hosted.md) for how to easily deploy your code.
3. Go to your GitHub repo (or org / user / sponsorship) webhook settings and enter the URL of the server. Additionally, select a key or limit the events sent.

## New manager

Create a new project or skip this step to continue in an existing project

```sh
# Create a new project
mkdir github-discord-project
cd github-discord-project

# Initialize
npm init -y
git init
```

Install the event package:

```sh
npm install github-discord-events
```

Then open your server and add the following example code:

```js
import { GitHubEventManager } from 'github-discord-events'

const manager = new GitHubEventManager({
    rules: { webhook: { url: 'discord_webhook_url' }}
})

// Combine the manager with your server 
app.post('/events', (req, res) => {
    const response = await manager.handleRequest(req)

    res.status(response.status).send(response.body)
})
```

The code for combining the manager with the server will differ for most platforms, so look at the documentation of your platform / package for the server to see how to implement that.
