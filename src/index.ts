import type { WebhookEventName } from '@octokit/webhooks-types'

import { defaultWebhookUser } from './data/Constants.js'
import { DiscordWebhookEmbed } from './discord/embed.js'

import type {
    DiscordWebhookUser,
    DiscordWebhookMessage,
} from './discord/webhook.js'

import type { GitHubEventRule } from './rules.js'
import type * as EmbedTypes from './discord/embeds/handler.js'

/**
 * Util function to strongly type the event payload. 
 * Can be used instead of the json structure.
 * @deprecated Use {@link RuleBuilder.event} instead
 */
function createEventRule<T extends WebhookEventName>(event: GitHubEventRule<T>): GitHubEventRule {
    return event as unknown as GitHubEventRule // ??
}

export * from './manager/index.js'
export * from './discord/events.js'
export * from './github.js'
export * from './rules.js'

export {
    createEventRule,
    DiscordWebhookEmbed,
    defaultWebhookUser,
}

export type {
    DiscordWebhookUser,
    DiscordWebhookMessage,
    EmbedTypes,
}
