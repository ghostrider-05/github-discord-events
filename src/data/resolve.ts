import type {
    RESTPostAPIWebhookWithTokenJSONBody,
    RESTPostAPIWebhookWithTokenQuery
} from "discord-api-types/v10"
import type { WebhookClientData } from "discord.js"

import { defaultWebhookUser } from "./Constants.js"
import type { DiscordWebhookMessage, DiscordWebhookUser } from "../discord/webhook.js"

function addQueryUrl(url: string, query: Record<string, any>) {
    const keys = Object.keys(query).map(key => key ? [key, query[key as keyof typeof query]?.toString()!] : [])
    const Query = new URLSearchParams(keys).toString()

    return url + (Query !== '' ? `?${Query}` : '')
}

const resolveWebhook = (data: WebhookClientData, query: RESTPostAPIWebhookWithTokenQuery, v: number) => {
    const webhookUrl = (id: string, token: string) => `https://discord.com/api/v${v}/${id}/${token}`

    if (!('url' in data || 'id' in data)) {
        throw new Error('Invalid webhook data provided: ' + JSON.stringify(data))
    }

    const url = 'url' in data ? data.url : webhookUrl(data.id, data.token)

    return addQueryUrl(url, query)
}

const resolveBody = (data: string | null | undefined, maxLength: number) => {
    if (!data) return undefined
    else if (data.length < maxLength) return data
    else return data.slice(0, maxLength).concat('...')
}

const resolveMessage = (
    message: DiscordWebhookMessage,
    user?: DiscordWebhookUser,
    thread_name?: string
): RESTPostAPIWebhookWithTokenJSONBody => {
    const { username, avatarURL } = user ?? defaultWebhookUser
    return {
        ...message,
        thread_name,
        username,
        avatar_url: avatarURL
    }
}

export const Resolvers = {
    body: resolveBody,
    message: resolveMessage,
    webhook: resolveWebhook
}
