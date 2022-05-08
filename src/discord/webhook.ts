import type {
    RESTPostAPIWebhookWithTokenJSONBody,
    RESTPostAPIWebhookWithTokenQuery,
    RESTGetAPIWebhookWithTokenResult
} from "discord-api-types/v9"
import type { WebhookClientData, WebhookMessageOptions } from "discord.js"

import { resolveWebhook } from "../data/resolve.js"

export type DiscordWebhookUser = Required<Pick<
    WebhookMessageOptions,
    | 'username'
    | 'avatarURL'
>>

export type DiscordWebhookMessage = Omit<
    RESTPostAPIWebhookWithTokenJSONBody,
    | 'attachments'
    | 'username'
    | 'avatar_url'
>

type DiscordWebhookData = WebhookClientData & {
    version: number
}

export async function fetchWebhook(webhook: DiscordWebhookData) {
    const url = resolveWebhook(webhook, {}, webhook.version)

    return await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()) as RESTGetAPIWebhookWithTokenResult | undefined
}

export async function postWebhook(
    webhook: DiscordWebhookData,
    data: RESTPostAPIWebhookWithTokenJSONBody,
    options: RESTPostAPIWebhookWithTokenQuery
) {
    const url = resolveWebhook(webhook, options, webhook.version)
    if (!data.content && !data.embeds) {
        throw new Error('Cannot send empty embed: ' + data)
    }

    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
