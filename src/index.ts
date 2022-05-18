import type { WebhookEvent, WebhookEventName } from '@octokit/webhooks-types'

import { defaultWebhookUser } from './data/Constants.js'
import { DiscordWebhookEmbed } from './discord/embed.js'
import { checkGitHubRules } from './filter.js'
import { Resolvers } from './data/resolve.js'
import {
    DiscordWebhookUser,
    DiscordWebhookMessage,
    WebhookManager,
    WebhookStorage
} from './discord/webhook.js'

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

export interface EventResponseBody {
    completed: boolean
    event: WebhookEvent | undefined
    action?: string
    rule?: GitHubEventRule
    eventName?: string
}

/**
 * Builder for creating filter rules
 */
export class RuleBuilder {
    /**
     * The created rule configuration
     */
    public rules: GitHubEventRulesConfig

    constructor(webhook: GitHubEventRulesConfig['webhook']) {
        this.rules = {
            webhook
        }
    }

    /**
     * Set a filter on the main rule
     * @param key The name of filter
     * @param value The new value of the filter
     */
    public setFilter<
        K extends keyof Omit<GitHubEventRulesConfig, 'webhook' | 'events'>
    >(key: K, value: GitHubEventRulesConfig[K]) {
        this.rules[key] = value

        return this
    }

    /**
     * Add an event rule for filtering events on their name
     * @param event The event rule
     */
    public addEvent<T extends WebhookEventName>(event: GitHubEventRule<T>): this {
        this.rules.events ??= []

        this.rules.events.push(<never>event)

        return this
    }

    /**
     * Returns an object containing the rules
     */
    public toJSON(): GitHubEventRulesConfig {
        return this.rules
    }

    /**
     * String representation of the rules.
     */
    public toString(): string {
        return JSON.stringify(this.toJSON())
    }
}

export class GitHubEventManager {
    public rules: GitHubEventRulesConfig
    public webhookUser: DiscordWebhookUser
    public filter: GitHubEventFilter

    public readonly apiVersion: number

    constructor(options: GitHubEventManagerOptions) {
        this.rules = options.rules instanceof RuleBuilder ? options.rules.toJSON() : options.rules
        this.webhookUser = options.user ?? defaultWebhookUser
        this.filter = options.filter ?? 'default'

        this.apiVersion = options.apiVersion ?? 9

        WebhookStorage.setAction(options.fetchWebhook)
    }

    private async _validateEvent(request: Request) {
        const name = request.headers.get('X-GitHub-Event') as WebhookEventName
        const event = await request.json() as WebhookEvent

        if (!name || !event) return undefined
        else return {
            name, event
        }
    }

    private getResponse (options: { status: number, statusText: string } & EventResponseBody) {
        const { status, statusText, ...body } = options

        return new Response(JSON.stringify(body), {
            status,
            statusText,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    /**
     * Handle an incoming request (via https, proxy, etc.) and perform actions based on the rules.
     * Use lifecycle hooks to add custom actions.
     * @param request The incoming request from your server
     * @returns The response whether the request was handled succesfully.
     * The response will contain the appropiate status and status text with a human readable summary / error.
     * The response body will contain a JSON object ({@link EventResponseBody}) with a more detailed response.
     */
    public async handleEvent(request: Request) {
        const data = await this._validateEvent(request)
        if (!data) return this.getResponse({
            statusText: 'Received invalid github webhook event',
            status: 500,
            completed: false,
            event: data
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

            const data = Resolvers.message(message, this.webhookUser)
            const webhook = rule.webhook ?? this.rules.webhook
            const webhookManager = new WebhookManager({
                version: this.apiVersion,
                ...webhook
            })

            if (this.rules.onBeforeActivated != undefined) {
                const webhookData = await webhookManager.get()
                await this.rules.onBeforeActivated(message, webhookData, 'name' in rule ? rule : undefined)
            }

            const completed = await webhookManager.post(data, {
                thread_id: rule.threadId,
                wait: rule.wait
            }).then(res => res.ok)

            return this.getResponse({
                status: completed ? 200 : 500,
                statusText: 'Completed GitHub event',
                completed: true,
                event,
                eventName: name,
                action: 'action' in event ? event.action : undefined
            })

        } else return this.getResponse({
            status: 404,
            statusText: 'Received GitHub event, but no rules matched',
            event,
            eventName: name,
            completed: false
        })
    }
}

/**
 * Util function to strongly type the event payload. 
 * Can be used instead of the json structure.
 * @deprecated
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
