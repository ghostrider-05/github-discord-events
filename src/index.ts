import type { WebhookEvent, WebhookEventName } from '@octokit/webhooks-types'
import type { RESTGetAPIWebhookWithTokenResult } from 'discord-api-types/v9'
import type { WebhookClientData } from 'discord.js'

import { defaultWebhookUser } from './data/Constants.js'
import { DiscordWebhookEmbed } from './discord/embed.js'
import { checkGitHubRules } from './filter.js'
import { resolveMessage } from './data/resolve.js'
import { DiscordWebhookUser, DiscordWebhookMessage, fetchWebhook, postWebhook } from './discord/webhook.js'

import type { GitHubEventRule, GitHubEventRulesConfig } from './rules.js'
import type * as EmbedTypes from './discord/embeds/handler.js'

export type GitHubEventFilter =
    | 'default'
    | 'all'

export interface GitHubEventManagerOptions {
    /**
     * The rules to use for filtering / sending events.
     */
    rules: GitHubEventRulesConfig
    /**
     * The Discord api version to use for webhook requests.
     * @default 9
     */
    apiVersion?: number
    /**
     * The webhook user to use for posting messages. Defaults to the GitHub profile
     */
    user?: DiscordWebhookUser
    /**
     * Filter for the incoming webhook events.
     * - default: only pass events that would be sent with a normal webhook
     * - all: continue with all incoming events
     * @default 'default'
     */
    filter?: GitHubEventFilter
    /**
     * For the `onBeforeActivated` hook, determine how often the Discord api 
     * will be used to fetch information about the webhook.
     * Options:
     * - all: fetch after every passed rule
     * - stored: only fetch when the webhook has not been fetched before. Does not update after this call.
     * - never: never fetch, `webhook` param will be the client data
     * @default 'never'
     */
    fetchWebhook?: 'all' | 'stored' | 'never'

    // Improves relative links like #42
    // Check autolinks
    //enhanceMarkdown?: boolean
}

export class GitHubEventManager {
    public rules: GitHubEventRulesConfig
    public webhookUser: DiscordWebhookUser
    public filter: GitHubEventFilter

    public readonly apiVersion: number

    private fetchedWebhooks: Record<string, RESTGetAPIWebhookWithTokenResult | undefined> = {}
    private fetchWebhook: 'all' | 'stored' | 'never'
    //private ruleQueue: [GitHubEventRule, number][] = []

    constructor(options: GitHubEventManagerOptions) {
        this.rules = options.rules
        this.webhookUser = options.user ?? defaultWebhookUser
        this.filter = options.filter ?? 'default'

        this.apiVersion = options.apiVersion ?? 9

        this.fetchWebhook = options.fetchWebhook ?? 'never'
    }

    private async _getWebhook(data: WebhookClientData) {
        const id = 'id' in data ? data.id : data.url

        if (this.fetchWebhook === 'never') {
            return this.fetchedWebhooks[id]

        } else if (this.fetchWebhook === 'stored' && this.fetchedWebhooks[id]) {
            return this.fetchedWebhooks[id]

        } else {
            const webhook = await fetchWebhook({ ...data, version: this.apiVersion })

            this.fetchedWebhooks[id] = webhook

            return webhook
        }
    }

    private async _validateEvent(request: Request) {
        const name = request.headers.get('X-GitHub-Event') as WebhookEventName
        const event = await request.json() as WebhookEvent

        if (!name || event) return undefined
        else return {
            name, event
        }
    }

    public async handleEvent(request: Request) {
        const data = await this._validateEvent(request)
        if (!data) return new Response('', {
            statusText: 'Received invalid github webhook event',
            status: 500
        })

        const { event, name } = data
        const rule = checkGitHubRules({
            event,
            filterEvents: this.filter === 'default',
            rules: this.rules,
            name
        })

        if (rule) {
            const defaultEmbed = DiscordWebhookEmbed.resolveEmbed(event, {
                name,
                saturation: rule.saturation ?? 1,
                filterEvents: this.filter === 'default'
            })

            const embeds = rule.transformEmbed?.(event, defaultEmbed) ?? defaultEmbed
            const message = rule.transformMessage?.(event, embeds) ?? (embeds ? { embeds } : {})

            const data = resolveMessage(message, this.webhookUser)
            const webhook = rule.webhook ?? this.rules.webhook

            if (this.rules.onBeforeActivated != undefined) {
                const webhookData = await this._getWebhook(webhook)
                await this.rules.onBeforeActivated(message, webhookData, 'name' in rule ? rule : undefined)
            }

            return await postWebhook({
                ...webhook,
                version: this.apiVersion
            }, data, {
                thread_id: rule.threadId,
                wait: rule.wait
            })
        } else return new Response('', {
            statusText: 'Received github event, but no rules matched',
            status: 404
        })
    }
}

/**
 * Util function to strongly type the event payload. 
 * Can be used instead of the json structure.
 */
function createEventRule<T extends WebhookEventName>(event: GitHubEventRule<T>): GitHubEventRule {
    return event as unknown as GitHubEventRule // ??
}

export * from './discord/events.js'
export * from './github.js'

export {
    createEventRule,
    DiscordWebhookEmbed,
    defaultWebhookUser,
}

export type {
    DiscordWebhookUser,
    DiscordWebhookMessage,
    EmbedTypes,
    GitHubEventRulesConfig,
    GitHubEventRule
}
