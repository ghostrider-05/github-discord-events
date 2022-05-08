import type {
    RESTPostAPIWebhookWithTokenJSONBody,
    RESTPostAPIWebhookWithTokenQuery
} from "discord-api-types/v9"
import type { WebhookClientData } from "discord.js"

import { defaultWebhookUser } from "./Constants.js"
import type { DiscordWebhookMessage, DiscordWebhookUser } from "../discord/webhook.js"

function addQueryUrl(url: string, query: Record<string, any>) {
    const keys = Object.keys(query).map(key => key ? [key, query[key as keyof typeof query]?.toString()!] : [])
    const Query = new URLSearchParams(keys).toString()

    return url + (Query !== '' ? `?${Query}` : '')
}

export const resolveWebhook = (data: WebhookClientData, query: RESTPostAPIWebhookWithTokenQuery, v: number) => {
    const webhookUrl = (id: string, token: string) => `https://discord.com/api/v${v}/${id}/${token}`

    if (!('url' in data || 'id' in data)) {
        throw new Error('Invalid webhook data provided: ' + JSON.stringify(data))
    }

    const url = 'url' in data ? data.url : webhookUrl(data.id, data.token)

    return addQueryUrl(url, query)
}

export const resolveBody = (data: string | null | undefined, maxLength: number) => {
    if (!data) return undefined
    else if (data.length < maxLength) return data
    else return data.slice(0, maxLength).concat('...')
}

export const resolveMessage = (
    message: DiscordWebhookMessage,
    user?: DiscordWebhookUser
): RESTPostAPIWebhookWithTokenJSONBody => {
    const { username, avatarURL } = user ?? defaultWebhookUser
    return {
        ...message,
        username,
        avatar_url: avatarURL
    }
}