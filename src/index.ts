import { defaultWebhookUser } from './data/Constants.js'
import { DiscordWebhookEmbed } from './discord/embed.js'

import type {
    DiscordWebhookUser,
    DiscordWebhookMessage,
} from './discord/webhook.js'

import type * as EmbedTypes from './discord/embeds/handler.js'

export * from './manager/index.js'
export * from './discord/events.js'
export * from './github.js'
export * from './rules.js'

export {
    DiscordWebhookEmbed,
    defaultWebhookUser,
}

export type {
    DiscordWebhookUser,
    DiscordWebhookMessage,
    EmbedTypes,
}
