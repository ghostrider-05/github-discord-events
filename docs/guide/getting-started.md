# Getting started

## Prerequisites

- http/https server: to handle incoming request you will need a server that can receive requests (e.g. serverless worker, node.js VPS)

## New project

This section will explain all the steps to create a project.

1. [Create a new Discord Webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) (or multiple webhooks) in the channel(s) you want the messages to send and copy it's URL.
2. Build your rules manager and deploy it to your server. See [the examples](../examples/stars.md) for code ideas and [the hosting guide](hosted.md) for how to easily deploy your code.
3. Go to your GitHub repo (or org / user / sponsorship) webhook settings and enter the URL of the server. Additionally, select a key or limit the events sent.
